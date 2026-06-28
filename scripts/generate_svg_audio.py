#!/usr/bin/env python3
"""
从 SVG 深度总结提取结构化旁白，用 edge-tts 合成自然中文语音（参考 audio-workshop / daily-algo）。

用法：
  python3 scripts/generate_svg_audio.py docs/svgs/2026-06-26/go-godebug-cleanup.svg
  python3 scripts/generate_svg_audio.py --all              # 全部 SVG
  python3 scripts/generate_svg_audio.py --missing          # 仅缺 MP3 的
  python3 scripts/generate_svg_audio.py --date=2026-06-26  # 指定日期目录
"""

import asyncio
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
SVGS_DIR = DOCS / "svgs"
AUDIO_DIR = DOCS / "audio"

DEFAULT_VOICE = "zh-CN-XiaoxiaoNeural"
MAX_CHUNK_LEN = 2000


def strip_html(html: str) -> str:
    if not html:
        return ""
    text = re.sub(r"<br\s*/?>", "，", html, flags=re.I)
    text = re.sub(r"</p>\s*<p[^>]*>", "\n", text, flags=re.I)
    text = re.sub(r"</(?:p|div|h\d|li|tr)>", "\n", text, flags=re.I)
    text = re.sub(r"<[^>]+>", "", text)
    text = text.replace("&lt;", "<").replace("&gt;", ">").replace("&amp;", "&")
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def svg_to_audio_path(svg_path: Path) -> Path:
    rel = svg_path.relative_to(DOCS)
    return AUDIO_DIR / rel.with_suffix(".mp3")


def parse_svg_html(svg_path: Path) -> str:
    text = svg_path.read_text(encoding="utf-8")
    m = re.search(
        r'<div xmlns="http://www.w3.org/1999/xhtml">(.*?)</div>\s*</foreignObject>',
        text,
        re.S,
    )
    if not m:
        raise ValueError(f"无法解析 SVG foreignObject: {svg_path}")
    return m.group(1)


def extract_title(html: str) -> str:
    m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)
    return strip_html(m.group(1)) if m else ""


def extract_tags(html: str) -> list[str]:
    tags = []
    for m in re.finditer(r'<span class="tag[^"]*">(.*?)</span>', html, re.S | re.I):
        t = strip_html(m.group(1))
        if t:
            tags.append(t)
    return tags[:4]


def extract_subtitle(html: str) -> str:
    m = re.search(r'<p class="subtitle"[^>]*>(.*?)</p>', html, re.S | re.I)
    return strip_html(m.group(1)) if m else ""


def extract_block_text(block_html: str) -> list[str]:
    parts: list[str] = []
    for tag in re.finditer(r"<h[23][^>]*>(.*?)</h[23]>", block_html, re.S | re.I):
        t = strip_html(tag.group(1))
        if t:
            parts.append(t)
    for tag in re.finditer(r"<p[^>]*>(.*?)</p>", block_html, re.S | re.I):
        t = strip_html(tag.group(1))
        if t:
            parts.append(re.sub(r"^(在讲什么问题|关键理解|核心机制|典型场景|边界说明|原文依据|相关概念|操作步骤|选型条件|避坑|对比相邻方法|原则|为什么重要|怎么落地|适用边界|坑名|原因|解法|严重程度|总结|行动清单|关键认知转变)[：:]\s*", r"\1，", t))
    for cls in ["quote", "highlight", "pitfall", "relation"]:
        for q in re.finditer(rf'<div class="{cls}"[^>]*>(.*?)</div>', block_html, re.S | re.I):
            t = strip_html(q.group(1))
            if t:
                parts.append(t)
    for row in re.finditer(r"<tr[^>]*>(.*?)</tr>", block_html, re.S | re.I):
        if "<th>" in row.group(1).lower():
            continue
        cells = [strip_html(c) for c in re.findall(r"<td[^>]*>(.*?)</td>", row.group(1), re.S | re.I)]
        cells = [c for c in cells if c]
        if cells:
            parts.append("，".join(cells))
    return parts


def extract_diagram_nodes(html: str) -> list[str]:
    m = re.search(r'<div class="map"[^>]*>(.*?)</div>\s*(?=<div class="(?:correction|card|rebuttal|conclusion)|\Z)', html, re.S | re.I)
    if not m:
        return []
    nodes = []
    for node in re.finditer(r'<div class="node[^"]*"[^>]*>(.*?)</div>', m.group(1), re.S | re.I):
        t = strip_html(node.group(1))
        if t:
            nodes.append(t)
    return nodes


def extract_sections(html: str) -> list[tuple[str, list[str]]]:
    sections: list[tuple[str, list[str]]] = []

    nodes = extract_diagram_nodes(html)
    if nodes:
        sections.append(("核心概念关系", ["关系脉络如下：" + "，然后".join(nodes)]))

    for cls, label in [("correction", "认知纠偏"), ("rebuttal", "反驳")]:
        m = re.search(rf'<div class="{cls}"[^>]*>(.*?)</div>\s*(?=<div class="(?:map|correction|card|rebuttal|conclusion)|\Z)', html, re.S | re.I)
        if m:
            parts = extract_block_text(m.group(1))
            if parts:
                sections.append((label, parts))

    for card in re.finditer(r'<div class="card"[^>]*>(.*?)</div>\s*(?=<div class="(?:card|rebuttal|conclusion)|\Z)', html, re.S | re.I):
        parts = extract_block_text(card.group(1))
        if parts:
            title = parts[0] if parts else "要点"
            sections.append((title, parts[1:] if len(parts) > 1 else parts))

    m = re.search(r'<div class="conclusion"[^>]*>(.*?)</div>', html, re.S | re.I)
    if m:
        parts = []
        for h2 in re.finditer(r"<h2[^>]*>(.*?)</h2>", m.group(1), re.S | re.I):
            t = strip_html(h2.group(1))
            if t:
                parts.append(t)
        for li in re.finditer(r"<li[^>]*>(.*?)</li>", m.group(1), re.S | re.I):
            t = strip_html(li.group(1))
            if t:
                parts.append(t)
        for p in re.finditer(r"<p[^>]*>(.*?)</p>", m.group(1), re.S | re.I):
            t = strip_html(p.group(1))
            if t:
                parts.append(t)
        if parts:
            sections.append(("总结与行动", parts))

    return sections


def _ordinal(n: int) -> str:
    names = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
             "十一", "十二", "十三", "十四", "十五"]
    if 1 <= n <= len(names):
        return f"第{names[n - 1]}"
    return f"第{n}"


def estimate_duration_label(char_count: int) -> str:
    minutes = char_count / 280
    low = max(1, int(minutes))
    high = max(low, int(minutes + 0.99))
    return f"约 {low} 分钟" if low == high else f"约 {low} 到 {high} 分钟"


def build_narration_script(svg_path: Path) -> str:
    html = parse_svg_html(svg_path)
    title = extract_title(html)
    tags = extract_tags(html)
    subtitle = extract_subtitle(html)
    sections = extract_sections(html)

    body_parts: list[str] = []

    if subtitle:
        body_parts.append(f"一句话概括。{subtitle}")

    for i, (sec_title, parts) in enumerate(sections, 1):
        body_parts.append(f"接下来，{_ordinal(i)}部分，{sec_title}。")
        body_parts.extend(parts)

    body_text = "\n\n".join(p.strip() for p in body_parts if p.strip())
    body_text = body_text.replace("→", "，得到").replace("=>", "等于")
    body_text = re.sub(r"`([^`]+)`", r"\1", body_text)

    tag_str = "、".join(tags) if tags else "技术"
    section_count = len(sections) + (1 if subtitle else 0)
    duration = estimate_duration_label(len(body_text) + 200)

    intro = (
        f"欢迎收听每日技术学习语音讲解。本期主题，{title}。"
        f"标签包括{tag_str}。"
        f"本次讲解预计时长 {duration}，共 {max(section_count, 1)} 个部分。"
        f"好，我们开始。"
    )

    outro = "讲解完毕。建议对照页面上的 SVG 卡片复习要点，并阅读原文加深理解。祝学习顺利！"
    return f"{intro}\n\n{body_text}\n\n{outro}"


def split_text(text: str, max_len: int = MAX_CHUNK_LEN) -> list[str]:
    if len(text) <= max_len:
        return [text]
    chunks = []
    current = ""
    for para in text.split("\n\n"):
        if len(para) > max_len:
            if current:
                chunks.append(current.strip())
                current = ""
            for i in range(0, len(para), max_len):
                chunks.append(para[i : i + max_len])
            continue
        candidate = f"{current}\n\n{para}".strip() if current else para
        if len(candidate) <= max_len:
            current = candidate
        else:
            if current:
                chunks.append(current.strip())
            current = para
    if current:
        chunks.append(current.strip())
    return chunks


async def _synthesize_chunk(text: str, output: Path, voice: str):
    import edge_tts

    communicate = edge_tts.Communicate(text, voice)
    await asyncio.wait_for(communicate.save(str(output)), timeout=180)


def _concat_mp3(files: list[Path], output: Path):
    list_file = output.parent / f".concat_{output.stem}.txt"
    try:
        with open(list_file, "w", encoding="utf-8") as f:
            for p in files:
                f.write(f"file '{p.resolve()}'\n")
        subprocess.run(
            ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(list_file), "-c", "copy", str(output)],
            check=True,
            capture_output=True,
        )
    finally:
        if list_file.exists():
            list_file.unlink()


async def synthesize_speech(text: str, output_path: Path, voice: str = DEFAULT_VOICE) -> bool:
    chunks = split_text(text)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    if len(chunks) == 1:
        await _synthesize_chunk(chunks[0], output_path, voice)
        return output_path.exists()

    temp_files = []
    try:
        for i, chunk in enumerate(chunks):
            tmp = output_path.parent / f".tmp_{output_path.stem}_{i}.mp3"
            await _synthesize_chunk(chunk, tmp, voice)
            temp_files.append(tmp)
        _concat_mp3(temp_files, output_path)
        return output_path.exists()
    finally:
        for f in temp_files:
            if f.exists():
                f.unlink()


def generate_for_svg(svg_path: Path, voice: str = DEFAULT_VOICE, force: bool = False) -> bool:
    svg_path = svg_path.resolve()
    if not svg_path.exists():
        print(f"✗ 文件不存在: {svg_path}")
        return False

    out_mp3 = svg_to_audio_path(svg_path)
    out_txt = out_mp3.with_suffix(".txt")

    if out_mp3.exists() and not force:
        print(f"○ 已存在，跳过: {out_mp3.relative_to(ROOT)}")
        return True

    try:
        script = build_narration_script(svg_path)
    except Exception as e:
        print(f"✗ 解析失败 {svg_path.name}: {e}")
        return False

    try:
        ok = asyncio.run(synthesize_speech(script, out_mp3, voice))
        if ok:
            out_txt.write_text(script, encoding="utf-8")
            size_kb = out_mp3.stat().st_size // 1024
            print(f"✓ {out_mp3.relative_to(ROOT)} ({size_kb} KB)")
        return ok
    except Exception as e:
        print(f"✗ 合成失败 {svg_path.name}: {e}")
        return False


def find_svg_files(date: str | None = None) -> list[Path]:
    if date:
        d = SVGS_DIR / date
        return sorted(d.glob("*.svg")) if d.is_dir() else []
    return sorted(SVGS_DIR.glob("*/*.svg"))


def main():
    from argparse import ArgumentParser

    parser = ArgumentParser(description="从 SVG 深度总结生成 edge-tts 语音讲解")
    parser.add_argument("svg", nargs="?", help="SVG 文件路径")
    parser.add_argument("--all", action="store_true", help="处理全部 SVG")
    parser.add_argument("--missing", action="store_true", help="仅处理尚无 MP3 的")
    parser.add_argument("--date", type=str, help="指定日期目录 YYYY-MM-DD")
    parser.add_argument("--force", action="store_true", help="覆盖已有 MP3")
    parser.add_argument("--voice", default=DEFAULT_VOICE)
    parser.add_argument("--print-script", action="store_true", help="只打印旁白稿")
    args = parser.parse_args()

    if args.print_script:
        if not args.svg:
            parser.error("需要指定 SVG 路径")
        print(build_narration_script(Path(args.svg)))
        return

    targets: list[Path] = []
    if args.svg:
        targets = [Path(args.svg)]
    elif args.all or args.missing or args.date:
        targets = find_svg_files(args.date)
        if args.missing:
            targets = [p for p in targets if not svg_to_audio_path(p).exists()]
    else:
        parser.error("请指定 SVG 路径，或使用 --all / --missing / --date")

    ok_count = 0
    for svg in targets:
        if generate_for_svg(svg, voice=args.voice, force=args.force):
            ok_count += 1

    print(f"\n完成: {ok_count}/{len(targets)}")
    sys.exit(0 if ok_count == len(targets) else 1)


if __name__ == "__main__":
    main()

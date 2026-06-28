import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'hermes-voice-mode.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:38px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.tag-red{background:#fee2e2;color:#991b1b}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #3b82f6}
.card h3{font-size:22px;font-weight:700;color:#1e40af;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .relation{background:#f0fdf4;padding:10px 14px;border-radius:10px;margin:8px 0;font-size:14px;color:#166534}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:24px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:20px 28px;text-align:center;min-width:130px;font-weight:700;font-size:16px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.arrow-sym{font-size:24px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#1e40af;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>Hermes 语音模式完全攻略：CLI + Telegram + Discord</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Hermes Agent</span>
  <span class="tag tag-green">语音交互</span>
  <span class="tag tag-orange">STT/TTS</span>
  <span class="tag tag-purple">零成本方案</span>
</div>
<p class="subtitle">本文解决的核心问题是：如何在 Hermes Agent 上搭建 CLI 按键录音、Telegram 语音气泡、Discord 语音频道三种交互表面，并在 10 种 TTS 与 6 种 STT 提供商中选出适合自己场景的配置组合，同时用幻觉过滤和四档 config.yaml 规避 Whisper 静音幻听等常见坑。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node">文字模式 Agent<br><span style="font-size:13px;font-weight:400">工具/记忆/Skill</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">三交互表面<br><span style="font-size:13px;font-weight:400">CLI/TG/Discord</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">STT 入口<br><span style="font-size:13px;font-weight:400">faster-whisper 等</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Agent 流水线<br><span style="font-size:13px;font-weight:400">与打字相同</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">TTS 出口<br><span style="font-size:13px;font-weight:400">Edge/ElevenLabs</span></div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「语音模式是独立功能，装个麦克风就行」—— 语音只是入口和出口，必须先让文字模式 Hermes 跑通；STT/TTS 选型、平台权限、ffmpeg/Opus 依赖任一缺失都会导致「能转写不说话」或 Telegram 无圆形气泡。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Hermes 三交互表面</h3>
  <p><strong>在讲什么问题：</strong>同一套 Agent 如何用三种不同 UX 接入语音——编码免提、移动语音气泡、团队语音频道。</p>
  <p><strong>核心机制：</strong>CLI 用 Ctrl+B 触发本地录音循环（3 秒静音自动停、流式 TTS 逐句朗读）；Telegram 通过 gateway 收 Opus 气泡，/voice on 实现「你发语音它回语音」；Discord Bot 加入语音频道，1.5 秒静音触发 STT，TTS 回频道且文字频道同步转写。</p>
  <p><strong>关键理解：</strong>三表面共享同一 Agent 流水线——语音触发的对话照样调工具、记记忆、跑 Skill。</p>
  <p><strong>典型场景：</strong>CLI 适合 tmux 旁路调试；Telegram 适合给非技术家人用；Discord 适合多人头脑风暴（独立音频流 + 回声防止）。</p>
  <p><strong>边界说明：</strong>Discord 仅 ALLOWED_USERS 可语音交互；频道 5 分钟无活动硬编码 300 秒自动离开；Telegram 语音数据仍存于其云端。</p>
  <div class="quote">「按一下 Ctrl+B 进入语音循环后，你只管说话，说完了 Agent 自动回答，回答完了自动等你下一句。」</div>
</div>

<div class="card">
  <h3>【方法/工具卡】零成本方案 faster-whisper + Edge TTS</h3>
  <p><strong>标签：</strong>个人开发 / 零 API 密钥 / 快速上手</p>
  <p><strong>核心思路：</strong>本地 faster-whisper 做 STT，Edge TTS 做合成，全套 $0。</p>
  <p><strong>操作步骤：</strong></p>
  <p>1. pipx install "hermes-agent[voice,messaging]"</p>
  <p>2. macOS: brew install portaudio ffmpeg opus espeak-ng；Ubuntu: apt install portaudio19-dev ffmpeg libopus0 espeak-ng</p>
  <p>3. pipx inject hermes-agent faster-whisper Pillow pydub pyaudio PyNaCl</p>
  <p>4. hermes doctor 确认 tts ✓ discord ✓</p>
  <p>5. hermes → /voice on → Ctrl+B 录音</p>
  <p><strong>选型条件：</strong>英文日常用 local base + Edge；中文识别换 medium + zh-CN-XiaoxiaoNeural。</p>
  <div class="pitfall"><strong>避坑：</strong>首次 STT 会静默下载 base 模型约 150MB（无进度条），CLI 像挂起——提前 pipx inject 触发缓存；缺 ffmpeg 时 Telegram 只能发文件附件而非圆形气泡。</div>
  <div class="highlight"><strong>渐进路径：</strong>第一天文字模式 → 第二天 CLI 语音 → 第三天 Telegram/Discord /voice on → 最后 Discord 语音频道，跳步难定位故障。</div>
</div>

<div class="card">
  <h3>【决策/选型表】STT/TTS 场景选型</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>零配置日常英文</td><td>local base + Edge TTS</td><td>默认即此组合，$0</td><td>一上来 large-v3</td><td>3GB 模型低配机器卡顿</td></tr>
    <tr><td>中文识别</td><td>local medium/small + Edge zh-CN</td><td>base 对中文断句偶有不准</td><td>仅 tiny 模型</td><td>幻觉多、精度差</td></tr>
    <tr><td>隐私/完全离线</td><td>local large-v3 + Piper/NeuTTS</td><td>零网络请求，音频不出机器</td><td>Edge TTS</td><td>需调用微软在线服务</td></tr>
    <tr><td>Telegram 圆形气泡</td><td>OpenAI/ElevenLabs/Mistral TTS 或 Edge+ffmpeg</td><td>Opus 原生或 ffmpeg 转 Opus</td><td>无 ffmpeg 的 Edge</td><td>只能矩形文件播放器</td></tr>
    <tr><td>云端极速 STT</td><td>Groq whisper-large-v3-turbo</td><td>约 0.5 秒延迟，有免费额度</td><td>仅 local tiny 在噪声环境</td><td>Whisper 静音幻觉约 1%</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】CLI vs Telegram vs Discord 语音频道</h3>
  <table>
    <tr><th>对比维度</th><th>CLI</th><th>Telegram</th><th>Discord 语音频道</th></tr>
    <tr><td>延迟</td><td>最低（本地处理）</td><td>中等（网络往返）</td><td>中等（网络+编解码）</td></tr>
    <tr><td>多人</td><td>单用户</td><td>单用户</td><td>多用户独立流</td></tr>
    <tr><td>免提循环</td><td>自动重启录音</td><td>需再次按住麦克风</td><td>持续监听频道</td></tr>
    <tr><td>额外依赖</td><td>sounddevice, numpy</td><td>python-telegram-bot, ffmpeg</td><td>discord.py[voice], Opus, PyNaCl</td></tr>
    <tr><td>文字联动</td><td>终端内显示</td><td>文字+语音并发</td><td>文字频道同步 [Voice] 转写</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】Whisper 幻觉与噪声环境</h3>
  <p><strong>坑名：</strong>静音或背景噪声被转写成「Thank you for watching」「请订阅」</p>
  <p><strong>原因：</strong>Whisper 约 1% 音频含完全虚构短语（Careless Whisper 论文）；长静音积累幻觉</p>
  <p><strong>原文说法：</strong>Hermes 内置 26 个多语言幻觉短语黑名单 + 正则 + 两阶段 VAD + 15 秒无语音超时</p>
  <p><strong>解法：</strong>silence_threshold 提到 300–400；silence_duration 加长到 4.0；STT 换 small/medium 或 Groq 云端</p>
  <p><strong>严重程度：</strong>小心（不会崩溃但 Agent 收到垃圾输入）</p>
  <div class="pitfall"><strong>坑名：</strong>Discord Bot 加入频道但听不到 → 检查 ALLOWED_USERS、特权意图 Message Content、Opus 库路径<br><strong>严重程度：</strong>致命（功能完全不可用）</div>
</div>

<div class="card">
  <h3>【心法/原则卡】先文字后语音，先单面后频道</h3>
  <p><strong>原则：</strong>语音是 Agent 流水线的 I/O 换皮，不是 shortcut——文字跑不通，语音只会把问题放大十倍。</p>
  <p><strong>为什么重要：</strong>STT、TTS、网络、Discord 权限、ffmpeg 任一环节失败，跳步部署无法判断根因。</p>
  <p><strong>原文支撑：</strong>「如果跳步直接搞语音频道，出问题时很难定位是 STT、TTS、网络还是权限的问题。」</p>
  <p><strong>怎么落地：</strong>Day1 hermes chat 文字 → Day2 /voice on + Ctrl+B → Day3 gateway + Telegram /voice on → Day4 Discord /voice join。</p>
  <p><strong>适用边界：</strong>若仅需 Telegram 给家人用，可跳过 Discord 语音频道；CLI 与 TUI 行为一致。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：企业安全合规官 / 语音数据驻留派</p>
  <p class="rebuttal-text">你把 faster-whisper 和 Edge TTS 包装成零成本最佳实践，却默认用户把语音经 Telegram 和 Discord 第三方服务器中转——本地 STT 只解决转写环节，传输与留存仍在境外 IM 云端，在 GDPR、等保和金融场景里这套「三表面免费搭建」根本过不了合规评审，所谓隐私优先离线档对多数用户只是自欺。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Hermes 语音覆盖 CLI（Ctrl+B 循环）、Telegram（voice_only 模式）、Discord 频道（多人+回声防止）三表面</li>
    <li>零成本栈：faster-whisper local base + Edge TTS，中文用 medium + zh-CN 语音</li>
    <li>10 TTS / 6 STT 按速度-质量-成本矩阵选型；STT 自动回退 local → groq → openai</li>
    <li>Whisper 幻觉靠 26 短语黑名单 + VAD 参数调优；Telegram 气泡需 Opus 或 ffmpeg</li>
    <li>四档 config.yaml：极速免费 / 高质量付费 / 完全离线 / 中文优化</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>hermes doctor 确认文字模式与依赖全绿</li>
    <li>pipx install hermes-agent[voice,messaging] + brew/apt 装 portaudio ffmpeg opus</li>
    <li>CLI 试 /voice on + Ctrl+B，确认 STT/TTS 闭环</li>
    <li>hermes gateway 接 Telegram，/voice on 测 voice_only</li>
    <li>按场景选四档 config 之一写入 config.yaml，噪声环境调高 silence_threshold</li>
  </ol>
  <p><strong>关键认知转变：</strong>语音不是新 Agent，而是同一 Agent 的免提 I/O——选型重点在 STT/TTS 与平台依赖，而非重新学一套对话逻辑。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');

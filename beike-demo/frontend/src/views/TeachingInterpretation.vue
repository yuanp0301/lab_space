<template>
  <div class="teaching-interpretation-view">
    <div class="page-header">
      <h1>教学解读与定位</h1>
      <p class="subtitle">《秋天的怀念》— 从备课起点到学情分析</p>
    </div>

    <el-card class="content-card">
      <el-tabs v-model="activeTab" type="border-card" class="main-tabs">
        <!-- Tab 1: 目标提炼 -->
        <el-tab-pane label="目标提炼" name="objectives">
          <div class="interpretation-section">
            <h2>初步研读：目标提炼——确立教学坐标</h2>

            <div class="subsection">
              <h3>1. 单元定位与课标对标</h3>
              <el-card shadow="hover" class="info-card">
                <div class="content-block">
                  <p>
                    <strong>单元要求</strong>（七年级上第二单元"至爱亲情"）：
                  </p>
                  <ul>
                    <li>①感受和理解亲情</li>
                    <li>②继续学习朗读，把握感情基调</li>
                    <li>③了解不同抒情特点（直白/含蓄）</li>
                    <li>④学习在叙事中用细节表达情感</li>
                  </ul>
                </div>
                <div class="content-block">
                  <p>
                    <strong>课标衔接：</strong
                    >对应"欣赏文学作品""品味语言""有自己的情感体验""获得人生启示"等要求。
                  </p>
                </div>
                <el-alert
                  type="success"
                  :closable="false"
                  class="highlight-alert"
                >
                  <p>
                    <strong>本课核心定位：</strong
                    >本单元的开篇与定调之作，是落实<span class="highlight-text"
                      >"朗读训练"</span
                    >和<span class="highlight-text">"细节悟情"</span
                    >的核心范本，兼具强烈的情感熏陶和深刻的生命教育价值。
                  </p>
                </el-alert>
              </el-card>
            </div>

            <div class="subsection">
              <h3>2. 确立核心素养学习目标</h3>
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-card shadow="hover" class="objective-card">
                    <template #header>
                      <div class="card-header">
                        <span>语言积累与建构</span>
                      </div>
                    </template>
                    <ul>
                      <li>掌握"瘫痪、憔悴、诀别"等关键词</li>
                      <li>通过朗读把握深沉内敛的感情基调</li>
                    </ul>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card shadow="hover" class="objective-card emphasis">
                    <template #header>
                      <div class="card-header">
                        <span>思维发展与提升</span>
                      </div>
                    </template>
                    <ul>
                      <li>梳理线索，通过细节分析人物形象（母亲与"我"）</li>
                      <li>理解复杂交织的情感（怀念、悔恨、愧疚、领悟）</li>
                    </ul>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card shadow="hover" class="objective-card emphasis">
                    <template #header>
                      <div class="card-header">
                        <span>审美鉴赏与创造</span>
                      </div>
                    </template>
                    <ul>
                      <li>赏析文章含蓄深沉、质朴有力的语言</li>
                      <li>学习细节描写、衬托、象征等手法</li>
                    </ul>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card shadow="hover" class="objective-card emphasis">
                    <template #header>
                      <div class="card-header">
                        <span>文化传承与理解</span>
                      </div>
                    </template>
                    <ul>
                      <li>感悟母爱的无私与坚韧</li>
                      <li>理解"好好儿活"的生命哲学，增进对亲情的体悟</li>
                    </ul>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-tab-pane>

        <!-- Tab 2: 课程内核 -->
        <el-tab-pane label="课程内核" name="core">
          <div class="interpretation-section">
            <h2>初步研读：课程内核</h2>

            <div class="subsection">
              <h3>1. 素读批注，记录原初感动</h3>
              <el-row :gutter="16">
                <el-col :span="8">
                  <el-card shadow="hover" class="emotion-card pain">
                    <h4>最刺痛处</h4>
                    <blockquote>"她出去了，就再也没回来。"</blockquote>
                    <p class="comment">—— 平静叙述下的永别之恸</p>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="hover" class="emotion-card excellent">
                    <h4>最精妙处</h4>
                    <blockquote>"母亲进来了，挡在窗前。"</blockquote>
                    <p class="comment">
                      —— 一个"挡"字，是爱的本能，是绝望的防火墙
                    </p>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="hover" class="emotion-card complex">
                    <h4>最复杂处</h4>
                    <blockquote>
                      "对于'跑'和'踩'一类的字眼儿，她比我还敏感。"
                    </blockquote>
                    <p class="comment">—— 爱的极致是战战兢兢</p>
                  </el-card>
                </el-col>
              </el-row>
            </div>

            <div class="subsection">
              <h3>2. 追问核心，抓住文本灵魂</h3>

              <el-card shadow="hover" class="core-question-card">
                <h4>核心矛盾是什么？</h4>
                <p>
                  儿子沉浸在<span class="highlight-text">自身残疾的痛苦</span
                  >中，母亲却独自承受着<span class="highlight-text"
                    >儿子痛苦 + 自身绝症 + 必须坚强</span
                  >的<span class="highlight-text">三重苦难</span
                  >。这份信息差与情感错位，是全文张力的根源。
                </p>
              </el-card>

              <el-card shadow="hover" class="core-question-card emphasis">
                <h4>教学支点在哪里？</h4>
                <p>
                  在于那些<span class="highlight-text">"无声"的细节</span>：
                </p>
                <el-tag type="danger" class="detail-tag">悄悄地躲</el-tag>
                <el-tag type="danger" class="detail-tag">偷偷地听</el-tag>
                <el-tag type="danger" class="detail-tag">眼边红红</el-tag>
                <el-tag type="danger" class="detail-tag">挡</el-tag>
                <el-tag type="danger" class="detail-tag">忍住哭声</el-tag>
                <el-tag type="danger" class="detail-tag">比我还敏感</el-tag>
                <p class="mt-2">
                  它们是母爱的密码，也是打开作者悔恨之门的钥匙。
                </p>
              </el-card>

              <el-card shadow="hover" class="core-question-card">
                <h4>终点指向何方？</h4>
                <p>
                  从<span class="highlight-text">"秋天的怀念"</span>到<span
                    class="highlight-text"
                    >"菊花的领悟"</span
                  >。
                </p>
                <ul class="direction-list">
                  <li>
                    理解"秋天"从<strong>时间背景</strong>升华为<strong
                      >生命境遇的象征</strong
                    >
                  </li>
                  <li>
                    "怀念"从<strong>情感追忆</strong>升华为<strong
                      >生命信念的继承</strong
                    >
                  </li>
                </ul>
              </el-card>
            </div>
          </div>
        </el-tab-pane>

        <!-- Tab 3: 要点整合与策略 -->
        <el-tab-pane label="要点整合与策略" name="strategy">
          <div class="interpretation-section">
            <h2>扩充参考：资源要点整合与教学转化策略</h2>
            <p class="section-intro">
              本部将各类资源中的核心教学要点，转化为可直接应用于课堂的具体策略与支点，为教学设计提供专业、可操作的方案。
            </p>

            <div class="subsection">
              <h3>维度一：整体教学设计——建构课堂逻辑与节奏</h3>
              <el-table
                :data="designStrategies"
                stripe
                border
                class="strategy-table"
              >
                <el-table-column
                  prop="point"
                  label="教学要点（资源核心提炼）"
                  width="260"
                />
                <el-table-column
                  prop="strategy"
                  label="教学支点与策略（课堂实施路径）"
                >
                  <template #default="scope">
                    <div v-html="scope.row.strategy"></div>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div class="subsection">
              <h3>维度二：文本解读——深入矛盾与人物内核</h3>
              <el-table
                :data="textStrategies"
                stripe
                border
                class="strategy-table"
              >
                <el-table-column
                  prop="point"
                  label="教学要点（资源核心提炼）"
                  width="260"
                />
                <el-table-column
                  prop="strategy"
                  label="教学支点与策略（课堂实施路径）"
                >
                  <template #default="scope">
                    <div v-html="scope.row.strategy"></div>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div class="subsection">
              <h3>维度三：语言品析——落实细节品味与手法领悟</h3>
              <el-table
                :data="languageStrategies"
                stripe
                border
                class="strategy-table"
              >
                <el-table-column
                  prop="point"
                  label="教学要点（资源核心提炼）"
                  width="260"
                />
                <el-table-column
                  prop="strategy"
                  label="教学支点与策略（课堂实施路径）"
                >
                  <template #default="scope">
                    <div v-html="scope.row.strategy"></div>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div class="subsection">
              <h3>维度四：朗读教学——以声入情，化言为悟</h3>
              <el-table
                :data="readingStrategies"
                stripe
                border
                class="strategy-table"
              >
                <el-table-column
                  prop="point"
                  label="教学要点（资源核心提炼）"
                  width="260"
                />
                <el-table-column
                  prop="strategy"
                  label="教学支点与策略（课堂实施路径）"
                >
                  <template #default="scope">
                    <div v-html="scope.row.strategy"></div>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div class="subsection">
              <h3>维度五：资源拓展——实现迁移与深度建构</h3>
              <el-table
                :data="extensionStrategies"
                stripe
                border
                class="strategy-table"
              >
                <el-table-column
                  prop="point"
                  label="教学要点（资源核心提炼）"
                  width="260"
                />
                <el-table-column
                  prop="strategy"
                  label="教学支点与策略（课堂实施路径）"
                >
                  <template #default="scope">
                    <div v-html="scope.row.strategy"></div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>

        <!-- Tab 4: 学情分析 -->
        <el-tab-pane label="学情分析" name="students">
          <div class="interpretation-section">
            <h2>学情分析：学情分析与对策预设</h2>

            <div class="subsection">
              <el-table
                :data="studentAnalysis"
                stripe
                border
                class="analysis-table"
              >
                <el-table-column
                  prop="dimension"
                  label="维度"
                  width="140"
                  align="center"
                >
                  <template #default="scope">
                    <el-tag :type="scope.row.tagType" size="large">{{
                      scope.row.dimension
                    }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="obstacles"
                  label="学生可能的障碍"
                  width="360"
                >
                  <template #default="scope">
                    <ol class="obstacle-list">
                      <li
                        v-for="(item, index) in scope.row.obstacles"
                        :key="index"
                      >
                        {{ item }}
                      </li>
                    </ol>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="strategies"
                  label="教师的搭桥策略（具体教学行为）"
                >
                  <template #default="scope">
                    <div v-html="scope.row.strategies"></div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const activeTab = ref("objectives");

// 维度一：整体教学设计
const designStrategies = ref([
  {
    point: '1. 双线并行：叙事明线（三次看花）与情感暗线（"我"的成长）。',
    strategy: `<strong>策略建议：可视化线索梳理</strong><br/>
      设计"双线追踪"学习单，引导学生在阅读中同步填写。一列梳理"看花"事件的时间、提议者与结果；另一列对应分析"我"的情感状态与关键表现。此工具旨在将内隐的情感变化外显，帮助学生<strong>具象化理解情节推进与心理成长的共生关系</strong>。`,
  },
  {
    point: "2. 情感节奏：文本情感张弛有度，形成独特的叙述韵律。",
    strategy: `<strong>策略建议：情感变化直观化</strong><br/>
      引导学生合作绘制全文"情感心电图"。以情节发展为横轴，情感强度为纵轴，共同标记关键段落的情感波峰（如暴怒、喜出望外）与波谷（沉寂、诀别），并标注文本依据。此活动旨在训练学生<strong>整体把握文本情感基调与内在节奏的能力</strong>。`,
  },
  {
    point: '3. 文眼聚焦："好好儿活"是统摄全篇的精神内核。',
    strategy: `<strong>策略建议：阶梯式主问题驱动</strong><br/>
      围绕"好好儿活"设计环环相扣的核心问题链：<br/>
      1. <strong>感知层</strong>：母亲在何种情境下说出这句话？她自身的处境如何？<br/>
      2. <strong>理解层</strong>：当时的"我"为何无法领会其深意？障碍何在？<br/>
      3. <strong>内化层</strong>：文章结尾，"我"对"好好儿活"的领悟与母亲的原初期望有何继承与发展？通过追问，引导学生完成对文眼从<strong>表层接收到深度理解与价值认同</strong>的思维进阶。`,
  },
]);

// 维度二：文本解读
const textStrategies = ref([
  {
    point: "1. 核心矛盾：儿子的显性痛苦与母亲的隐性痛苦构成巨大张力。",
    strategy: `<strong>策略建议：认知冲突情境创设</strong><br/>
      抛出深度思辨问题：<strong>"文中，究竟谁承受着更沉重的苦难？"</strong>组织学生进行基于文本的证据性辩论。此活动旨在引导学生超越表象，通过对比分析，<strong>深刻体认母亲所承载的"三重苦难"及其蕴含的爱的强度</strong>。`,
  },
  {
    point:
      "2. 人物形象：母亲形象是隐忍、细心、无私、坚韧、睿智等多维特质的有机融合。",
    strategy: `<strong>策略建议：证据链人物分析法</strong><br/>
      开展"细节为证，为母亲画像"活动。要求学生不以概括性形容词先行，而是从文中筛选3-5处最富表现力的细节（动作、神态、语言），并阐释每一处细节揭示了人物何种特质。最终师生共同整合，<strong>完成一个由文本证据支撑的、立体的母亲形象建构</strong>。`,
  },
  {
    point: '3. 标题深意："秋天"与"怀念"均具有表层与深层双重意蕴。',
    strategy: `<strong>策略建议：标题比较与重构</strong><br/>
      在课堂收束阶段，引导学生进行<strong>标题的替换与比较</strong>（如改为《春天的怀念》或《忆母亲》）。通过对比分析，结合结尾"菊花"意象与生命感悟，引导学生自主阐释"秋天"作为<strong>生命境遇象征</strong>（凋零与成熟并存）以及"怀念"作为<strong>精神传承</strong>的深层内涵。`,
  },
]);

// 维度三：语言品析
const languageStrategies = ref([
  {
    point: "1. 细节描写：精准的动词、叠词、副词是情感的微观载体。",
    strategy: `<strong>策略建议：对比删改品析</strong><br/>
      针对关键语句（如"悄悄地躲"、"再也沒回来"），采用"原文—删改版"对比朗读与品析。引导学生聚焦被删改的词语，讨论其在刻画人物心理、渲染情感氛围上的不可替代性，从而<strong>习得通过关键字词透视文本情感的方法</strong>。`,
  },
  {
    point: "2. 象征手法：菊花的多元色彩象征母爱的不同维度与生命的应然姿态。",
    strategy: `<strong>策略建议：意象解读三级跳</strong><br/>
      对结尾菊花描写，设计渐进式解读阶梯：<br/>
      1. <strong>描述感知</strong>：不同颜色的菊花分别给你怎样的直观感受？<br/>
      2. <strong>关联迁移</strong>：这种感受，让你联想到文中母亲的哪些品质或时刻？<br/>
      3. <strong>升华主旨</strong>：作者浓墨重彩地描写"泼泼洒洒"的菊花，其意图仅在于写景吗？它象征着怎样的生命态度？此流程旨在帮助学生<strong>自然生成对象征意义的理解，避免机械套用</strong>。`,
  },
  {
    point: "3. 含蓄风格：克制叙述与艺术留白强化了情感冲击力。",
    strategy: `<strong>策略建议：留白处深度叩问</strong><br/>
      聚焦母亲未说完的遗言，设计探究问题：<strong>"作者为何在此处使用省略号而非补全语句？如果补全，表达效果有何损失？"</strong>通过讨论，引导学生领悟<strong>含蓄与留白在表达深沉复杂情感时，所具有的"此时无声胜有声"的艺术效果</strong>。`,
  },
]);

// 维度四：朗读教学
const readingStrategies = ref([
  {
    point: "1. 把握基调：全篇情感基调深沉内敛而富于变化。",
    strategy: `<strong>策略建议：范读引领与感知标注</strong><br/>
      播放优质范读音频，要求学生在聆听时同步进行"情感感知标记"（如在沉重处画波浪线，在舒缓处画直线，在停顿处长记号）。听后分享标记意图，<strong>在声音的直观浸润中初步把握文本的情感脉络</strong>。`,
  },
  {
    point: "2. 分角色体悟：通过声音演绎区别人物性格与心境。",
    strategy: `<strong>策略建议：角色化朗读设计</strong><br/>
      选取典型对话段落（如第1、3段），指导学生进行<strong>"声音造型"</strong>。先分析人物特定情境下的心理状态，再共同设计其台词应有的语气、语调、语速、重音，并通过演读加以呈现和评议。旨在<strong>通过声音的外化，促进对人物内在世界的内化理解</strong>。`,
  },
  {
    point: "3. 朗读内化：将个人理解与情感体验通过朗诵进行创造性输出。",
    strategy: `<strong>策略建议：个性化深情朗诵展示</strong><br/>
      在深度学习后，设置"我的文中金句"朗诵环节。每位学生精选一句最有感触的语句，精心打磨朗读技巧后，面向全班诵读并简要陈述选择理由。此活动是<strong>对文本的回归、对理解的表达，也是对情感的升华</strong>。`,
  },
]);

// 维度五：资源拓展
const extensionStrategies = ref([
  {
    point: "1. 知人论世：史铁生的生平是理解其作品的精神底色。",
    strategy: `<strong>策略建议：背景资料介入</strong><br/>
      采用"嵌入式背景介绍"，将作者生平资料分解为若干片段，在學生理解遭遇障碍时精准投送。例如，在分析"我"的暴怒时，插入其瘫痪前作为运动健将的资料，<strong>制造命运的巨大反差，深化共情</strong>；在探讨生命感悟时，链接《我与地坛》相关哲思段落，<strong>拓展文本的哲学维度</strong>。`,
  },
  {
    point: "2. 群文阅读：通过群文比读，深化对母爱多样性的认识。",
    strategy: `<strong>策略：比较阅读任务</strong><br/>
      将《合欢树》（节选）作为课后拓展材料，设计精炼的<strong>比较阅读思考题</strong>："两篇文章中的母亲，在关爱儿子的具体方式上，表现出怎样不同的特点？"引导学生辨析《秋》的隐忍克制与《合》的执着坚韧，从而<strong>建构对母爱表现形式多元化的认知</strong>。`,
  },
  {
    point: "3. 写作迁移：借鉴文本细节抒情的方法进行微写作。",
    strategy: `<strong>策略：微格写作训练</strong><br/>
      布置"捕捉亲情微光"情景写作任务。<br/>
      要求：模仿课文"让细节说话"的手法，描写一个与亲人相处的瞬间，<strong>仅通过1-2个细微的动作、神态或语言描写来传递情感，避免直接抒情</strong>。提供评价量表，强调细节的真实性与表现力。`,
  },
]);

// 学情分析数据
const studentAnalysis = ref([
  {
    dimension: "认知与经验",
    tagType: "warning",
    obstacles: [
      '难以想象"瘫痪"对运动青年的毁灭性打击。',
      '对"肝癌晚期"的痛苦无概念。',
      '对"暴怒无常"的理解停留在"脾气坏"。',
    ],
    strategies: `<strong>1. 背景反差渲染</strong>：出示史铁生年轻时跨栏照片与文字描述，与其瘫痪后的状态形成<strong>视觉与心理的强对比</strong>。<br/>
      <strong>2. 痛苦具体化</strong>：解释"整宿整宿翻来覆去"，用<strong>"从深夜到黎明，每分钟都在忍受"</strong>来量化母亲的煎熬。<br/>
      <strong>3. 情绪溯源</strong>：提问："如果你最引以为傲的能力一夜之间永远失去，你会如何？"<strong>链接次级挫折体验</strong>，理解暴怒是绝望的外衣。`,
  },
  {
    dimension: "情感与共情",
    tagType: "danger",
    obstacles: [
      '易将母爱简单理解为"对我好"。',
      '难以体会作者"子欲养而亲不待"的永恒悔恨。',
      "对平静叙述下的情感风暴不敏感。",
    ],
    strategies: `<strong class="highlight-bg">1. 矛盾体验法</strong>：设问："母亲自己痛不欲生，却要对儿子说'好好儿活'，她难不难？为什么能做到？"引导学生感受爱的<strong class="highlight-bg">"反本能"的坚韧</strong>。<br/>
      <strong>2. 副词放大镜</strong>：重点品析"一直"、"再也"。通过删词对比（如"不知道" vs "一直不知道"），<strong>放大悔恨的重量</strong>。<br/>
      <strong>3. 留白处叩问</strong>：针对母亲未说完的遗言，提问："省略号里是什么？为什么作者不写出来？"体会<strong>"无言"胜"有言"</strong>的震撼。`,
  },
  {
    dimension: "思维与方法",
    tagType: "info",
    obstacles: [
      '阅读停留在情节概括和主题标签化（如"母爱伟大"）。',
      "不会主动抓取和深度分析细节。",
      '对象征的理解机械（如"菊花=坚强"）。',
    ],
    strategies: `<strong class="highlight-bg">1. 提供"分析支架"</strong>：在小组探究时，给出任务单，引导从<strong class="highlight-bg">"找出细节" → "分析怎么写（词、句）" → "体会为何这么写（情感、人物）"</strong>层层深入。<br/>
      <strong>2. 示范"细读"</strong>：教师以第一段为例，示范如何从一个"扑"字，分析出母亲的惊慌、心痛与决绝。<br/>
      <strong>3. 阶梯式解读象征</strong>：解读菊花时，三步走：<strong>①描述客观形态</strong>（颜色、姿态）→ <strong>②链接人物品质</strong>（让你想到母亲的什么？）→ <strong>③升华主题内涵</strong>（这仅仅是写花吗？它代表了什么期望？）。`,
  },
]);
</script>

<style scoped lang="scss">
.teaching-interpretation-view {
  .page-header {
    margin-bottom: 24px;
    padding: 24px 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

    h1 {
      margin: 0 0 8px 0;
      color: #ffffff;
      font-size: 32px;
      font-weight: 600;
    }

    .subtitle {
      margin: 0;
      color: rgba(255, 255, 255, 0.9);
      font-size: 16px;
    }
  }

  .content-card {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border-radius: 8px;

    :deep(.el-tabs__content) {
      padding: 32px;
      min-height: 600px;
    }

    :deep(.el-tabs__header) {
      background: #f8f9fa;
    }

    :deep(.el-tabs__item) {
      font-size: 15px;
      font-weight: 500;
      padding: 0 24px;
    }
  }

  .interpretation-section {
    h2 {
      color: #1a2332;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 3px solid #667eea;
      font-size: 24px;
      font-weight: 600;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        bottom: -3px;
        left: 0;
        width: 80px;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
      }
    }

    .section-intro {
      color: #666;
      font-size: 15px;
      line-height: 1.8;
      margin-bottom: 24px;
      padding: 16px;
      background: #f8f9fa;
      border-left: 4px solid #667eea;
      border-radius: 4px;
    }

    .subsection {
      margin-bottom: 40px;

      h3 {
        color: #2d3e50;
        margin-bottom: 20px;
        font-size: 20px;
        font-weight: 600;
        padding-left: 12px;
        border-left: 4px solid #667eea;
      }

      h4 {
        color: #1a2332;
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: 600;
      }

      p {
        line-height: 1.9;
        color: #555;
        margin-bottom: 12px;
        font-size: 15px;
      }

      ul,
      ol {
        line-height: 2;
        color: #555;
        padding-left: 20px;

        li {
          margin-bottom: 12px;
          font-size: 15px;

          strong {
            color: #1a2332;
            font-weight: 600;
          }

          p {
            margin: 8px 0 0 0;
            font-size: 14px;
            color: #777;
          }
        }
      }
    }

    // Info Card
    .info-card {
      border-radius: 8px;
      border: 2px solid #e8eaed;
      transition: all 0.3s ease;

      &:hover {
        border-color: #667eea;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
      }

      .content-block {
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        ul {
          margin-top: 12px;
          padding-left: 24px;

          li {
            color: #555;
            line-height: 1.8;
            margin-bottom: 8px;
          }
        }
      }
    }

    // Highlight Alert
    .highlight-alert {
      margin-top: 20px;
      background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
      border: none;
      border-radius: 8px;
      padding: 16px;

      :deep(.el-alert__content) {
        width: 100%;
      }

      p {
        margin: 0;
        color: #2e7d32;
        font-size: 15px;
        line-height: 1.8;
      }
    }

    .highlight-text {
      color: #667eea;
      font-weight: 600;
      padding: 2px 6px;
      background: rgba(102, 126, 234, 0.1);
      border-radius: 4px;
    }

    // Objective Cards
    .objective-card {
      border-radius: 8px;
      border: 2px solid #e8eaed;
      margin-bottom: 16px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      &.emphasis {
        border-color: #f1a2ab;
        background: linear-gradient(135deg, #fff5f7 0%, #ffffff 100%);

        .card-header {
          color: #d32f2f;
        }
      }

      .card-header {
        font-weight: 600;
        color: #1a2332;
        font-size: 15px;
      }

      ul {
        padding-left: 20px;
        margin: 0;

        li {
          line-height: 1.9;
          margin-bottom: 10px;
          color: #555;
        }
      }
    }

    // Emotion Cards
    .emotion-card {
      border-radius: 8px;
      padding: 20px;
      transition: all 0.3s ease;
      border: 2px solid transparent;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      &.pain {
        background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
        border-color: #ffcdd2;

        h4 {
          color: #d32f2f;
        }
      }

      &.excellent {
        background: linear-gradient(135deg, #f3e5f5 0%, #ffffff 100%);
        border-color: #e1bee7;

        h4 {
          color: #7b1fa2;
        }
      }

      &.complex {
        background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%);
        border-color: #bbdefb;

        h4 {
          color: #1976d2;
        }
      }

      blockquote {
        margin: 16px 0;
        padding: 12px 16px;
        background: rgba(0, 0, 0, 0.03);
        border-left: 4px solid currentColor;
        font-style: italic;
        color: #333;
        line-height: 1.8;
      }

      .comment {
        color: #666;
        font-size: 14px;
        margin: 0;
        font-style: italic;
      }
    }

    // Core Question Cards
    .core-question-card {
      margin-bottom: 20px;
      border-radius: 8px;
      padding: 24px;
      border: 2px solid #e8eaed;
      background: #fafbfc;
      transition: all 0.3s ease;

      &:hover {
        border-color: #667eea;
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
      }

      &.emphasis {
        background: linear-gradient(135deg, #fff5f7 0%, #fafbfc 100%);
        border-color: #f1a2ab;
      }

      h4 {
        color: #667eea;
        font-size: 18px;
        margin-bottom: 16px;
        font-weight: 600;
      }

      p {
        margin-bottom: 12px;
        line-height: 1.9;
      }

      .detail-tag {
        margin: 4px 8px 4px 0;
        padding: 6px 12px;
        font-size: 14px;
      }

      .mt-2 {
        margin-top: 16px;
      }

      .direction-list {
        margin: 16px 0 0 0;
        padding-left: 24px;

        li {
          margin-bottom: 12px;
          color: #555;
          line-height: 1.9;

          strong {
            color: #667eea;
            font-weight: 600;
          }
        }
      }
    }

    // Strategy Table
    .strategy-table {
      margin-top: 20px;
      border-radius: 8px;
      overflow: hidden;

      :deep(.el-table__header) {
        th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          font-weight: 600;
          font-size: 14px;
        }
      }

      :deep(.el-table__body) {
        td {
          padding: 16px 12px;
          line-height: 1.8;
          font-size: 14px;

          strong {
            color: #667eea;
            font-weight: 600;
          }

          br {
            margin: 8px 0;
          }
        }
      }
    }

    // Analysis Table
    .analysis-table {
      margin-top: 20px;
      border-radius: 8px;
      overflow: hidden;

      :deep(.el-table__header) {
        th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          font-weight: 600;
          font-size: 14px;
        }
      }

      :deep(.el-table__body) {
        td {
          padding: 20px 16px;
          line-height: 1.8;
          font-size: 14px;

          strong {
            color: #667eea;
            font-weight: 600;
          }

          .highlight-bg {
            background: rgba(241, 162, 171, 0.2);
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 600;
            color: #d32f2f;
          }

          br {
            margin: 8px 0;
          }
        }
      }

      .obstacle-list {
        margin: 0;
        padding-left: 20px;

        li {
          margin-bottom: 8px;
          color: #555;
          line-height: 1.8;
        }
      }
    }

    .el-alert {
      margin-top: 16px;
      border-radius: 8px;
    }

    .el-card {
      margin-bottom: 16px;

      .card-header {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: bold;
      }
    }
  }
}
</style>

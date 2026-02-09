<template>
  <div class="knowledge-system-view">
    <div class="page-header">
      <h1>知识点体系</h1>
      <p class="subtitle">系统化的语文知识点结构</p>
    </div>

    <div class="content-wrapper">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-card class="tree-card">
            <template #header>
              <div class="card-header">
                <span>知识点树</span>
                <el-input
                  v-model="searchKeyword"
                  placeholder="搜索知识点"
                  :prefix-icon="Search"
                  clearable
                  size="small"
                  style="width: 200px"
                />
              </div>
            </template>

            <el-tree
              ref="treeRef"
              :data="knowledgeTree"
              :props="treeProps"
              :filter-node-method="filterNode"
              node-key="id"
              default-expand-all
              highlight-current
              @node-click="handleNodeClick"
            >
              <template #default="{ node, data }">
                <span class="tree-node">
                  <el-icon v-if="data.icon" :color="data.color">
                    <component :is="data.icon" />
                  </el-icon>
                  <span>{{ node.label }}</span>
                  <el-tag v-if="data.count" size="small" type="info">{{
                    data.count
                  }}</el-tag>
                </span>
              </template>
            </el-tree>
          </el-card>
        </el-col>

        <el-col :span="16">
          <el-card v-if="selectedNode" class="detail-card">
            <template #header>
              <div class="card-header">
                <el-icon v-if="selectedNode.icon" :color="selectedNode.color">
                  <component :is="selectedNode.icon" />
                </el-icon>
                <span>{{ selectedNode.label }}</span>
                <el-tag
                  v-if="selectedNode.level"
                  :type="getLevelType(selectedNode.level)"
                >
                  {{ selectedNode.level }}
                </el-tag>
              </div>
            </template>

            <div class="knowledge-detail">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="知识点ID">{{
                  selectedNode.id
                }}</el-descriptions-item>
                <el-descriptions-item label="难度等级">
                  <el-rate
                    v-model="selectedNode.difficulty"
                    disabled
                    show-score
                    text-color="#ff9900"
                  />
                </el-descriptions-item>
                <el-descriptions-item label="所属类别" :span="2">
                  {{ selectedNode.category || "未分类" }}
                </el-descriptions-item>
                <el-descriptions-item label="知识点描述" :span="2">
                  {{ selectedNode.description || "暂无描述" }}
                </el-descriptions-item>
              </el-descriptions>

              <div v-if="selectedNode.examples" class="examples-section">
                <h3>典型示例</h3>
                <el-timeline>
                  <el-timeline-item
                    v-for="(example, index) in selectedNode.examples"
                    :key="index"
                    :timestamp="example.title"
                  >
                    <p>{{ example.content }}</p>
                    <el-tag v-if="example.source" size="small" type="success">
                      出处：{{ example.source }}
                    </el-tag>
                  </el-timeline-item>
                </el-timeline>
              </div>

              <div
                v-if="selectedNode.relatedMaterials"
                class="materials-section"
              >
                <h3>相关素材</h3>
                <el-space wrap>
                  <el-tag
                    v-for="material in selectedNode.relatedMaterials"
                    :key="material"
                    type="primary"
                    effect="plain"
                  >
                    {{ material }}
                  </el-tag>
                </el-space>
              </div>

              <div v-if="selectedNode.teachingTips" class="tips-section">
                <h3>教学建议</h3>
                <el-alert type="info" :closable="false">
                  <p>{{ selectedNode.teachingTips }}</p>
                </el-alert>
              </div>
            </div>
          </el-card>

          <el-empty v-else description="请从左侧选择知识点查看详情" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import {
  Search,
  Reading,
  Edit,
  ChatDotRound,
  PictureFilled,
} from "@element-plus/icons-vue";
import type { ElTree } from "element-plus";

const treeRef = ref<InstanceType<typeof ElTree>>();
const searchKeyword = ref("");
const selectedNode = ref<any>(null);

const treeProps = {
  children: "children",
  label: "label",
};

const knowledgeTree = ref([
  {
    id: "language-accumulation",
    label: "语言积累运用",
    icon: Reading,
    color: "#4a90e2",
    children: [
      {
        id: "chinese-words",
        label: "汉字词语",
        icon: Edit,
        color: "#67c23a",
        children: [
          {
            id: "pronunciation",
            label: "字音字形",
            level: "基础知识点",
            difficulty: 1,
            category: "语言积累运用 > 汉字词语",
            description: "掌握课文重点字词的读音和写法",
            examples: [
              {
                content: "瘫痪（tān huàn）",
              },
              {
                content: "侍弄（shì）",
              },
              {
                content: "捶打（chuí）",
              },
              {
                content: "整宿（xiǔ）",
              },
              {
                content: "憔悴（qiáo cuì）",
              },
              {
                content: "仿膳（shàn）",
              },
              {
                content: "豌豆（wān）",
              },
              {
                content: "诀别（jué）",
              },
              {
                content: "絮叨（xù）",
              },
              {
                content: "翻来覆去（fù）",
              },
              {
                content: "泼泼洒洒（sǎ）",
              },
            ],
          },
          {
            id: "word-meaning",
            label: "字词释义",
            level: "基础知识点",
            difficulty: 1,
            category: "语言积累运用 > 汉字词语",
            description: "理解课文重点词语的含义",
            examples: [
              {
                title: "词语释义",
                content:
                  "沉寂：十分寂静。喜出望外：遇到出乎意料的喜事而特别高兴。絮絮叨叨：形容说话啰嗦，来回地说。诀别：指再无会期的离别；死别。翻来覆去：形容一次又一次地来回翻动身体。淡雅：素净雅致。高洁：高尚纯洁。烂漫：颜色鲜明而美丽；坦率自然，毫不做作。",
                source: "课文原文",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "literature-culture",
    label: "文学文化常识",
    icon: Reading,
    color: "#e6a23c",
    children: [
      {
        id: "author-works",
        label: "作家作品",
        icon: ChatDotRound,
        color: "#409eff",
        children: [
          {
            id: "author-info",
            label: "作者信息",
            children: [
              {
                id: "shi-tiesheng",
                label: "史铁生",
                level: "核心知识点",
                difficulty: 3,
                category: "文学文化常识 > 作家作品",
                description: "了解作者史铁生的生平、经历及与本文的关联",
                examples: [
                  {
                    title: "生平与经历",
                    content:
                      "史铁生（1951-2010），北京人，中国当代著名作家。1967年毕业于清华大学附属中学，1969年去陕西延安插队，1972年因脊髓疾病导致双腿瘫痪，回到北京。后又患肾病并发展为尿毒症，需靠透析维持生命。他自称'职业是生病，业余在写作'。在病榻上坚持创作，作品多反思生命、死亡、苦难与爱。曾任中国作家协会委员、北京作家协会副主席。",
                    source: "作者简介",
                  },
                  {
                    title: "与本文关联",
                    content:
                      "本文是其亲身经历的写照。'我'21岁瘫痪后的暴怒绝望、母亲身患肝病的隐忍与突然离世，均基于真实事件。这使得文章情感基石无比坚实，字字泣血，句句含情。理解史铁生其人，是深入理解《秋天的怀念》中那份刻骨铭心的痛苦、悔恨与最终生命领悟的前提。",
                    source: "背景分析",
                  },
                ],
              },
            ],
          },
          {
            id: "creation-background",
            label: "创作背景",
            level: "重点知识点",
            difficulty: 2,
            category: "文学文化常识 > 作家作品",
            description: "理解作品的写作时间、缘由和现实生活映射",
            examples: [
              {
                title: "写作时间与缘由",
                content:
                  "本文写于1981年，最初发表于《南风报》。此时距离作者母亲去世（约在1977年）已过去数年。文章是作者在母亲去世七年后，痛定思痛之作。时间的距离让他能从最初的巨大悲痛中稍得喘息，以相对冷静的笔触回望那段黑暗岁月，但追忆之中，歉疚与怀念之情反而愈发深沉凝重。",
                source: "写作背景",
              },
              {
                title: "现实生活映射",
                content:
                  "文中母亲的'肝病'实为肝癌。母亲在儿子遭遇人生巨创（瘫痪）后，强忍自身绝症的剧痛，将全部心力甚至生命都投入到鼓励、照料儿子之中，直至油尽灯枯。这一真实背景，使得文中每一个细节都承载着双倍的重量——既是儿子的痛苦，更是母亲在儿子痛苦之上叠加的、独自吞咽的更大痛苦。",
                source: "背景分析",
              },
            ],
          },
          {
            id: "works-info",
            label: "作品信息",
            children: [
              {
                id: "related-texts",
                label: "《合欢树》等关联文本",
                level: "拓展知识点",
                difficulty: 3,
                category: "文学文化常识 > 作家作品",
                description: "了解史铁生其他怀念母亲的作品，进行互文阅读",
                examples: [
                  {
                    title: "《合欢树》",
                    content:
                      "史铁生另一篇怀念母亲的散文，堪称《秋天的怀念》的姊妹篇。文中更详细地记述了母亲在他残疾后，不放弃任何希望，执着地为他寻医问药、搜集偏方的过程，以及母亲去世后他对'子欲养而亲不待'的锥心之痛。其中名句：'她心里太苦了。上帝看她受不住了，就召她回去。'直接揭示了母亲承受的非凡苦难，可以作为理解《秋天的怀念》中母亲形象和作者愧疚心理的极佳互文材料。将两篇文章结合阅读，能构建起一个更丰满、更立体的史铁生母亲的形象，也能更深刻地体会作者情感世界的复杂与深沉。",
                    source: "《合欢树》",
                  },
                ],
                teachingTips: "建议与《合欢树》《我与地坛》对比阅读，加深理解",
              },
            ],
          },
        ],
      },
      {
        id: "literary-genre",
        label: "文学体裁",
        icon: PictureFilled,
        color: "#67c23a",
        children: [
          {
            id: "modern-prose",
            label: "中国现当代及外国散文",
            children: [
              {
                id: "narrative-prose",
                label: "叙事散文",
                level: "重点知识点",
                difficulty: 3,
                category: "文学文化常识 > 文学体裁",
                description: "理解叙事散文的概念和本文的体裁特点",
                examples: [
                  {
                    title: "概念",
                    content:
                      "以记叙人物、事件为主的散文。它不像小说那样追求完整的故事情节和尖锐的矛盾冲突，但所叙之事相对具体、集中，并在叙事的过程中鲜明地渗透着作者浓烈的主观感情、认知与思考，带有显著的抒情色彩。",
                    source: "文体知识",
                  },
                  {
                    title: "以事传情，情事交融",
                    content:
                      "全文不是抽象地抒情，而是紧紧围绕'去北海看菊花'这一中心事件，串联起'我'发脾气、母亲隐瞒病情、央求看花、突然离世等几个生活片段。叙事是骨架，情感是血肉，作者对母亲的怀念、愧疚与对生命的领悟，全都融化在这些具体可感的叙述之中。",
                    source: "体裁特点",
                  },
                  {
                    title: "强烈的抒情性",
                    content:
                      "文章的根本目的不在于记事本身，而在于通过记事来抒发胸中郁积的深沉情感。叙事是手段，抒情是归宿。这种情，是经过时间沉淀后愈发醇厚的怀念，是痛彻心扉的悔恨，也是豁然开朗的领悟。",
                    source: "体裁特点",
                  },
                  {
                    title: "高度的真实性",
                    content:
                      "作为回忆性散文，其人物、事件、情感均源于作者的真实生命体验。这种'非虚构'的特质，赋予了文章直击人心的力量，读者深知这非杜撰的故事，因而更易产生共鸣与震撼。",
                    source: "体裁特点",
                  },
                  {
                    title: "形散神聚，结构精巧",
                    content:
                      "材料看似琐碎（砸玻璃、母亲躲出去、妹妹告知病情、挡在窗前、絮叨往事、临终遗言等），但都被'母爱'与'我'的'情感成长'这两条主线紧紧凝聚。以'看花'为明线贯穿，使文章散而不乱，形神兼备。",
                    source: "体裁特点",
                  },
                ],
                teachingTips: "对比小说和散文的异同，强调散文的真实性和抒情性",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "text-appreciation",
    label: "文本鉴赏与表达",
    icon: Reading,
    color: "#f56c6c",
    children: [
      {
        id: "content-theme",
        label: "内容与主题",
        icon: ChatDotRound,
        color: "#409eff",
        children: [
          {
            id: "text-title",
            label: "文本标题",
            level: "核心知识点",
            difficulty: 4,
            category: "文本鉴赏与表达 > 内容与主题",
            description: "理解标题《秋天的怀念》的表层含义和深层意蕴",
            examples: [
              {
                title: "表层含义",
                content:
                  "直接点明文章记叙的核心时节（秋天）与核心情感（怀念），清晰地揭示了这是一篇在秋季写下的、追忆逝去亲人的文章。",
                source: "标题分析",
              },
              {
                title: "秋天的多重象征意蕴",
                content:
                  "①现实的季节：母亲在秋天病重、离世；②生命的隐喻：象征生命的成熟期，收获与凋零并存；③情感的容器：容纳了死亡、怀念、悔恨，以及从苦难中升腾出的生命领悟。",
                source: "深层赏析",
              },
              {
                title: "怀念的复杂情感内核",
                content:
                  "①对母亲个体的深切思念；②浸透着无尽的悔恨与愧疚——恨自己当年的暴怒、愧对母亲的病情一直不知；③升华为积极的生命领悟——怀念并继承母亲的生命信念。",
                source: "深层赏析",
              },
            ],
            teachingTips:
              "标题是全文的文眼，既限定范围，又打开深邃的情感与思想空间",
          },
          {
            id: "main-content",
            label: "主要内容",
            level: "重点知识点",
            difficulty: 3,
            category: "文本鉴赏与表达 > 内容与主题",
            description: "概括文章主要内容、核心冲突和情感脉络",
            examples: [
              {
                title: "内容概括",
                content:
                  "本文记叙了双腿瘫痪后的我陷入暴怒与绝望，而身患绝症的母亲隐藏病痛，用耐心和隐忍呵护我的心灵，反复提议推我去北海看菊花。就在我同意、母亲满怀希望准备次日出行时，她突然病发离世。母亲去世后的秋天，我在妹妹陪伴下去北海看菊花，从那泼洒烂漫的生命姿态中，真正懂得了母亲未说完的话，领悟了好好儿活的真谛。",
                source: "课文分析",
              },
              {
                title: "核心冲突",
                content:
                  "儿子因生理残缺和精神崩溃产生的绝望、自毁倾向，与母亲用尽生命最后力量进行的拯救、引导之间的激烈冲突。",
                source: "课文分析",
              },
              {
                title: "情感脉络",
                content:
                  "从绝望暴怒 → 麻木妥协 → 震惊悔恨 → 领悟坚定的完整心路历程。",
                source: "课文分析",
              },
            ],
          },
          {
            id: "plot-events",
            label: "情节与事件",
            level: "重点知识点",
            difficulty: 3,
            category: "文本鉴赏与表达 > 内容与主题",
            description: "分析文章的五个关键事件及其作用",
            examples: [
              {
                title: "事件一：瘫痪暴怒，母亲隐忍安抚（第1段）",
                content:
                  "我因无法接受瘫痪现实，砸玻璃、摔东西。母亲悄悄地躲出去，在门外偷偷地听着，待我平静后悄悄地进来，眼红红地提议去北海看花。当我捶腿喊出我可活什么劲儿时，母亲扑过来抓住我的手，忍住哭声说好好儿活。",
                source: "课文第1段",
              },
              {
                title: "事件二：插叙病情，揭示双重苦难（第2段）",
                content:
                  "通过妹妹之口，插叙交代母亲早已病入膏肓，肝疼得整宿整宿翻来覆去地睡不了觉，而我却全然不知。这是理解全文情感重量的关键钥匙。",
                source: "课文第2段",
              },
              {
                title: "事件三：央求看花，喜悦与伤痛交织（第3段）",
                content:
                  "一个秋日，我望着飘落的树叶发呆，母亲挡在窗前，憔悴的脸上带着央求的神色再次提议看菊花。我的同意让她喜出望外，兴奋地絮叨起往事，却不慎说出跑着一脚踩扁一个触动儿子痛处的话，敏感地住口，悄悄地出去了。",
                source: "课文第3段",
              },
              {
                title: "事件四：骤然离世，留下永恒诀别（第4-6段）",
                content:
                  "母亲出去后，就再也没能回来。她被抬上车时大口大口地吐着鲜血，临终前昏迷中仍念叨着我那个有病的儿子和我那个还未成年的女儿……",
                source: "课文第4-6段",
              },
              {
                title: "事件五：北海赏菊，领悟中完成升华（第7段）",
                content:
                  "又一个秋天，妹妹推着我去了北海。菊花在秋风中开得泼泼洒洒、烂漫夺目。我懂得了母亲没有说完的话，和妹妹一起，要好好儿活。",
                source: "课文第7段",
              },
            ],
          },
          {
            id: "sentence-understanding",
            label: "词句理解",
            level: "核心知识点",
            difficulty: 5,
            category: "文本鉴赏与表达 > 内容与主题",
            description: "深入理解关键句子和重要词语的含义",
            examples: [
              {
                title: "关键句1：咱娘儿俩在一块儿，好好儿活，好好儿活……",
                content:
                  "①语言形式：完全口语，朴素到极致，反复修辞强化情感上的急切恳求。②母亲心理：这是目睹孩子即将自我毁灭时的本能呼喊，咱娘儿俩在一块儿给予安全感，好好儿活是唯一的要求与期望。③丰富内涵：包含三层意思——首先要活着，其次要好好地活，更深层要领悟怎么活。这是全文的文眼。",
                source: "课文第1段",
              },
              {
                title:
                  "关键句2：我懂得母亲没有说完的话。妹妹也懂。我俩在一块儿，要好好儿活……",
                content:
                  "①与开头呼应：从母亲的被动哀求变成我的主动承诺，从外在要求内化为生命信念。②懂得的深意：标志着精神成长的完成，终于理解了母亲当年的沉默、隐忍、小心翼翼和那句话背后如山之爱、如海之痛。③生命的传承与救赎：母亲没有说完的话由我和妹妹来续写并践行，母爱在儿女生命中得以延续。",
                source: "课文第7段",
              },
              {
                title: "关键词：一直（可我却一直都不知道）",
                content:
                  "副词，强调时间延续性和状态的毫无例外。表达了我当时完全沉浸于自身痛苦漩涡中，对母亲正在承受的更大苦难竟然毫无察觉，充满了对自己的痛悔与谴责。",
                source: "课文第2段",
              },
              {
                title: "关键词：再也（就再也没回来）",
                content:
                  "副词，表示永远、绝无可能。强调母亲去世这一事实的绝对性和不可逆转性，传达出永失母爱的空洞、绝望和绵延无尽的遗恨。",
                source: "课文第4段",
              },
              {
                title: "关键词：绝和竟（绝没有想到那竟是永远的诀别）",
                content:
                  "绝：绝对，根本，强调出乎意料程度达到极致。竟：竟然，表示出乎意料。两个副词连用，极写我当时毫无心理准备，这种准备不足与残酷现实的巨大落差，使得事后回想充满加倍的震惊和噬心的自责悔恨。",
                source: "课文第5段",
              },
            ],
          },
          {
            id: "author-emotion",
            label: "作者情感",
            level: "核心知识点",
            difficulty: 4,
            category: "文本鉴赏与表达 > 内容与主题",
            description: "理解作者多层次、复杂交织的情感变化",
            examples: [
              {
                title: "对母亲的深切怀念",
                content:
                  "怀念母亲的音容笑貌，怀念她悄悄进出的身影，怀念她央求的神色和絮叨的话语。这种怀念因生死相隔而显得无比绵长和忧伤。",
                source: "情感分析",
              },
              {
                title: "强烈的悔恨与愧疚",
                content:
                  "①恨自己当年的暴怒无常对母亲的伤害；②愧自己对母亲病情的无知与忽视；③痛子欲养而亲不待的永恒遗憾。这是怀念中最刺痛人心的部分。",
                source: "情感分析",
              },
              {
                title: "对母爱的感激与赞颂",
                content:
                  "在深切的怀念与悔恨中，升腾起对母亲人格的无限敬仰。感激她在绝境中给予的包容与守护，赞颂她超越生死的坚韧、无私与伟大。",
                source: "情感分析",
              },
              {
                title: "对生命意义的领悟与坚定抉择",
                content:
                  "从母亲的言行和离世中，领悟到生命的脆弱与珍贵，领悟到面对无法改变的苦难时，人唯一能掌握的就是自己的态度。情感从悲伤怀旧拔升，走向豁达、平静与坚定。",
                source: "情感分析",
              },
            ],
          },
          {
            id: "theme-idea",
            label: "主题思想",
            level: "核心知识点",
            difficulty: 5,
            category: "文本鉴赏与表达 > 内容与主题",
            description: "把握文章的三位一体核心主题",
            examples: [
              {
                title: "歌颂伟大、无私、坚韧的母爱",
                content:
                  "文章通过一系列感人至深的细节，塑造了一位在自身生命垂危之际，仍将全部身心、智慧乃至生命奉献给残疾儿子的母亲形象。母爱在这里被诠释为理解、隐忍、牺牲和永不放弃的希望。",
                source: "主题分析",
              },
              {
                title: "表达子欲养而亲不待的永恒悔恨与生命教育",
                content:
                  "文章深刻揭示了青少年成长中的普遍现象——往往专注于自身痛苦，而容易忽略身边亲人默默付出的爱与承受的痛。这种忽略可能带来无法弥补的终身遗憾，具有深刻的警醒与教育意义。",
                source: "主题分析",
              },
              {
                title: "揭示勇敢面对苦难、珍爱生命、好好儿活的积极生命哲学",
                content:
                  "文章超越个人情感，达到哲理高度。它告诉读者，生命的价值不在于是否完美、是否遭遇厄运，而在于以何种态度去面对。即使命运给予的是残缺与痛苦，人依然可以选择坚强、选择热爱、选择有尊严有意义地活。这是一种在绝境中实现精神超越的救赎之路。",
                source: "主题分析",
              },
            ],
          },
        ],
      },
      {
        id: "character-portrayal",
        label: "形象塑造",
        icon: PictureFilled,
        color: "#67c23a",
        children: [
          {
            id: "character-image",
            label: "人物形象",
            level: "核心知识点",
            difficulty: 4,
            category: "文本鉴赏与表达 > 形象塑造",
            description: "深入分析母亲和我的人物形象特点",
            examples: [
              {
                title: "母亲形象：隐忍坚强到极致",
                content:
                  "①表现：双重隐忍——一忍自身整宿整宿翻来覆去的肝癌剧痛，对儿子绝口不提；二忍儿子因绝望而发的所有暴怒无常，从未抱怨，只是悄悄地躲出去。②解读：她的坚强是沉默的，在沉默中承受双倍于常人的苦难。这坚强源于最本能的母爱，让她如同大地一般，默默吸纳所有苦痛，只为给儿子留下一片看似平静的土壤。",
                source: "人物分析",
              },
              {
                title: "母亲形象：无私忘我，将孩子置于生命之上",
                content:
                  "①表现：为了照顾儿子，她侍弄的那些花都死了——放弃了个人的精神寄托；昏迷前的最后一句话，牵挂的仍是有病的儿子和未成年的女儿。②解读：这是一种完全利他、近乎圣洁的爱。在她的价值排序中，儿子的生命和心理健康远远高于自己的病痛、爱好乃至生命。她的存在，仿佛就是为了成全儿子的生。",
                source: "人物分析",
              },
              {
                title: "母亲形象：细心体贴到令人心碎",
                content:
                  "①表现：动作永远是悄悄地；会挡在窗前生怕飘零的落叶加深儿子的悲观；对于跑踩一类的字眼儿，她比我还敏感，立刻住口悄悄离开。②解读：她的爱深入到了儿子精神世界的每一个褶皱。她不仅在照顾儿子的生活，更在小心翼翼地呵护他那颗破碎、敏感、易怒的自尊心。这份体贴，充满了卑微的、战战兢兢的深情。",
                source: "人物分析",
              },
              {
                title: "母亲形象：睿智坚韧，善于引导",
                content:
                  "①表现：她没有进行空洞的说教，而是反复提议去北海看菊花。菊花在秋天绽放，具有顽强的生命力象征。②解读：这体现了母亲的生活智慧和对儿子心理的深刻理解。她懂得，直接的说理无法打动一颗绝望的心。她选择用美好的自然景象和愉快的童年记忆作为媒介，潜移默化地唤起儿子对世界的留恋、对生命的热爱。看花，是她设计的帮助儿子走出心灵牢笼的康复方案。",
                source: "人物分析",
              },
              {
                title: "我的形象：前期（瘫痪初期）",
                content:
                  "被命运击垮的绝望者。表现为暴怒无常（砸、摔）、悲观绝望（活什么劲儿）、自我封闭、对周围的爱与痛苦视而不见。这是一个深陷在自身悲剧中、无法自拔的典型形象。",
                source: "人物分析",
              },
              {
                title: "我的形象：后期（母亲去世后）",
                content:
                  "在痛苦中觉醒的领悟者。经历了失去这最沉重的一课，情感从最初的震惊与茫然（绝没有想到），迅速转化为深切的悔恨与愧疚。最终，在怀念与追忆中，完成了精神的顿悟与成长，理解了母爱的全部重量，并将母亲的期望内化为自己的生命信念，走向了坚强与新生。",
                source: "人物分析",
              },
            ],
            teachingTips:
              "使用对比表格展示人物性格对比，引导学生理解人物形象的层次性",
          },
          {
            id: "character-emotion",
            label: "人物情感",
            level: "重点知识点",
            difficulty: 3,
            category: "文本鉴赏与表达 > 形象塑造",
            description: "梳理母亲和我的情感世界及发展流变",
            examples: [
              {
                title: "母亲的情感世界",
                content:
                  "①对儿子：深沉的、无条件的爱与怜惜；无尽的担忧（怕他轻生）；卑微而急切的期望（盼他好好儿活）。②对自己：极致的隐忍（忍病痛，忍心痛）与孤独的坚毅。③特定时刻：在儿子同意看花时，流露出压抑已久的、卑微的喜悦与希望；在不慎说错话后，则是瞬间的惊慌、自责与更深的小心翼翼。",
                source: "情感分析",
              },
              {
                title: "我的情感发展：第1段",
                content: "暴怒、绝望、自暴自弃。情感如火山爆发，充满破坏性。",
                source: "课文第1段",
              },
              {
                title: "我的情感发展：第2段（插叙/事后视角）",
                content:
                  "追悔莫及，痛彻心扉。这是叙述者现在的情感，回望过去时的自责。",
                source: "课文第2段",
              },
              {
                title: "我的情感发展：第3段",
                content:
                  "消沉、麻木、略带烦躁（烦不烦？）。暴怒期过去，陷入更深的抑郁，但对母亲的央求有了一丝妥协与不忍。",
                source: "课文第3段",
              },
              {
                title: "我的情感发展：第4-6段",
                content:
                  "极度的震惊、突如其来的巨大悲痛、以及随之而来的、肝肠寸断的悔恨。情感遭受重创，达到最低谷。",
                source: "课文第4-6段",
              },
              {
                title: "我的情感发展：第7段",
                content:
                  "沉静、深切的怀念、豁然开朗后的领悟，以及领悟带来的平静与坚定。情感从谷底攀升、升华，走向光明与力量。",
                source: "课文第7段",
              },
            ],
            teachingTips:
              "用情感曲线图可视化情感变化，帮助学生理解人物心路历程",
          },
        ],
      },
      {
        id: "structure-layout",
        label: "结构布局",
        icon: ChatDotRound,
        color: "#e6a23c",
        children: [
          {
            id: "text-structure",
            label: "文本结构",
            level: "重点知识点",
            difficulty: 3,
            category: "文本鉴赏与表达 > 结构布局",
            description: "分析文章的三段式结构及各部分作用",
            examples: [
              {
                title: "第一部分（第1-2段）：苦难的降临与母亲的承受",
                content:
                  "内容：直接切入我瘫痪后的暴怒状态，展现母亲最初的隐忍与安抚，并通过妹妹之口插叙，揭示母亲早已病重却隐瞒的真相。作用：开篇造势，迅速将读者带入故事核心矛盾中。初步刻画母子二人的极端状态，为全文奠定沉重、哀伤的基调。插叙是关键一笔，丰富了母亲形象，埋下巨大情感伏笔。",
                source: "结构分析",
              },
              {
                title: "第二部分（第3-6段）：希望的微光与永恒的诀别",
                content:
                  "内容：写母亲在秋天再次央求并成功说服我去看菊花，她喜出望外、憧憬未来，却因一句话触痛我而敏感中止。随后，她突然病发，在大口大口地吐着鲜血中离去，临终遗言满是不舍与牵挂。作用：这是情节的发展、转折与高潮。希望的火花短暂明亮，却瞬间被死亡的疾风扑灭，形成巨大情感落差。母亲的离世将矛盾推向顶点，彻底改变了我的情感世界。",
                source: "结构分析",
              },
              {
                title: "第三部分（第7段）：怀念的沉淀与生命的领悟",
                content:
                  "内容：又一个秋天，妹妹推我去北海看菊花。我看到菊花绚烂的生命姿态，终于懂得了母亲的未尽之言，决心和妹妹好好儿活。作用：这是故事的结局与主题的升华。完成了母亲的心愿，实现了叙事闭环。更重要的是，它将情感从个人悲痛的宣泄，引向对生命意义的理性思考与积极实践。以景结情，意境深远，使文章获得了向上、向光的精神力量。",
                source: "结构分析",
              },
            ],
            teachingTips: "使用思维导图展示文章结构，帮助学生理清思路",
          },
          {
            id: "text-clue",
            label: "文本线索",
            level: "重点知识点",
            difficulty: 4,
            category: "文本鉴赏与表达 > 结构布局",
            description: "理解文章的明线（叙事线索）和暗线（精神线索）",
            examples: [
              {
                title: "明线（叙事线索）：三次去北海看菊花的提议与实现过程",
                content:
                  "第一次（第1段）：母亲提议，我暴怒拒绝。第二次（第3段）：母亲再提议，我勉强同意，但母亲突然离世，未能成行。第三次（第7段）：母亲去世后，妹妹推我前往，最终实现。作用：使全文叙事集中，脉络清晰，结构严谨。看花是贯穿始终的具体事件，是母爱的行动载体，也是我情感变化的见证物和催化剂。",
                source: "线索分析",
              },
              {
                title:
                  "暗线（情感与精神线索）：我对母亲的理解程度与自身生命态度的变化",
                content:
                  "这条线更为重要，是文章的灵魂。其过程为：完全沉浸于自身痛苦，忽视甚至抗拒母爱 → 隐约感受到母亲的关切，有所触动但仍麻木 → 痛失母爱，在震惊中开始反思，悔恨交加 → 在追忆与象征物（菊花）的启示下，彻底读懂母爱，完成精神成长，主动继承好好儿活的生命信念。作用：所有事件、细节都服务于这条暗线的推进。它揭示了人物内心成长的完整轨迹，展现了情感从混沌到觉醒、从绝望到希望的内在逻辑，是文章打动人心、引发深思的根本所在。",
                source: "线索分析",
              },
            ],
            teachingTips: "使用双线索图示帮助学生理解明暗两条线索的交织",
          },
          {
            id: "sentence-paragraph",
            label: "句段安排",
            children: [
              {
                id: "ending-analysis",
                label: "结尾（第7段）——重点赏析",
                level: "核心知识点",
                difficulty: 5,
                category: "文本鉴赏与表达 > 结构布局",
                description: "深入分析结尾段的景物描写和象征意义",
                examples: [
                  {
                    title: "景物描写的深层意蕴（象征手法）：色彩的象征",
                    content:
                      "①黄色的花淡雅：象征母爱的质朴、温和、不事张扬，如同大地般给予人温暖的依靠。②白色的花高洁：象征母亲人格的纯洁、无私与高尚，她为了儿子奉献一切，毫无保留，品格如玉。③紫红色的花热烈而深沉：象征母爱的强烈、执着与隐忍的深情。这份爱外表平静，内里却如岩浆般炽热；它承受着巨大的苦难（深沉的底色），却依然迸发出热烈的生命能量。",
                    source: "课文第7段",
                  },
                  {
                    title: "景物描写的深层意蕴（象征手法）：姿态描写的象征",
                    content:
                      "①泼泼洒洒：叠词，形容菊花开放得毫无拘束、尽情倾泻的状态。这不仅写出了菊花生命力的旺盛与洒脱，更象征了母亲对儿女生命的最终期望——希望他们能摆脱痛苦的束缚，让生命自由、奔放、尽情地绽放。②秋风中正开得烂漫：烂漫一词极写其盛开之盛、之美。在萧瑟的秋风中如此绽放，本身就是一种对逆境的抗争与胜利。这象征了好好儿活的理想状态：无论命运如何严酷，都要活出自己的精彩与美丽。因此，北海的菊花，不仅是自然景物，更是母亲精神的化身，是好好儿活这一抽象理念的具象呈现。",
                    source: "课文第7段",
                  },
                  {
                    title: "情感与主题的终极升华",
                    content:
                      "①从怀念到践行：结尾看花，表面上是对母亲的怀念，实质上是对母亲遗愿的完成和生命信念的践行。怀念不再是沉溺于过去的悲伤，而是转化为面向未来的积极行动。②生命的传承与超越：我懂得了母亲没有说完的话，意味着母爱在我的精神世界里生根发芽。母亲的生命，在我好好儿活的承诺与实践中得到了延续和超越。个体生命的悲剧，由此获得了普遍的精神价值。③以景结情，含蓄隽永：将对母亲的无尽怀念、深刻领悟和坚定决心，全部寄托于对灿烂秋景的描绘之中。不直接抒情，而情意满溢；不说教，而哲理自现。这种结尾方式，意境开阔，给读者留下了广阔的思考与回味空间，艺术感染力极强。",
                    source: "结尾赏析",
                  },
                  {
                    title: "结构上的完美作用",
                    content:
                      "①照应开头：与第一段母亲听说北海的花儿都开了，我推着你去走走的提议遥相呼应，使文章结构完整，浑然一体。②解答悬念：回答了看花这一线索的最终结局。③情感闭环：将全文的情感从开篇的低沉、暴烈，经过中间的悲痛、悔恨，最终引向结尾的沉静、明朗与坚定，完成了一个从死到生的情感闭环与升华。",
                    source: "结构作用",
                  },
                ],
                teachingTips:
                  "引导学生理解以景结情的含蓄手法，体会象征的深层含义",
              },
            ],
          },
        ],
      },
      {
        id: "language-techniques",
        label: "语言技巧",
        icon: Edit,
        color: "#f56c6c",
        children: [
          {
            id: "expression-method",
            label: "表达方式",
            children: [
              {
                id: "description",
                label: "描写",
                children: [
                  {
                    id: "character-description",
                    label: "人物描写",
                    level: "核心知识点",
                    difficulty: 5,
                    category: "文本鉴赏与表达 > 语言技巧",
                    description:
                      "分析文中的动作描写、语言描写、神态描写、细节描写",
                    examples: [
                      {
                        title: "动作描写：母亲就悄悄地躲出去……又悄悄地进来",
                        content:
                          "两个悄悄，一个躲，一个进，构成了母亲面对儿子暴怒时的标准动作模式。躲是理解与退让，给予空间；进是牵挂与关怀，及时抚慰。这一连串轻微到几乎无声的动作，胜过千言万语，写尽了母亲的无奈、心痛与坚韧的爱。",
                        source: "课文第1段",
                      },
                      {
                        title: "动作描写：母亲扑过来抓住我的手",
                        content:
                          "扑和抓是两个迅疾、有力、甚至有些失态的动作。它生动刻画出在儿子表露轻生念头的那个瞬间，母亲内心巨大的恐慌与急切。这是一种本能的、想要阻止悲剧发生的反应，爱与恐惧交织，极具视觉和情感冲击力。",
                        source: "课文第1段",
                      },
                      {
                        title: "动作描写：母亲进来了，挡在窗前",
                        content:
                          "一个挡字，是全文最经典的动作之一。它不是一个简单的走位，而是一个充满保护意味的、下意识的姿态。母亲用身体为儿子隔绝了窗外象征衰落与伤感的落叶景象，试图为他隔出一片充满生机（菊花）的视野。这个动作，是母爱最直观、最有力的身体语言。",
                        source: "课文第3段",
                      },
                      {
                        title: "动作描写：她高兴得一会坐下，一会站起",
                        content:
                          "通过坐和站这两个简单动作的快速交替，淋漓尽致地展现了母亲内心因儿子一个简单承诺而掀起的巨大波澜。那种坐立不安、手足无措的兴奋，反衬出她平日承受的压抑之深，也凸显了这微小希望对她而言是何等珍贵。",
                        source: "课文第3段",
                      },
                      {
                        title: "语言描写：母亲的语言特点",
                        content:
                          "特点是简短、朴素、充满商量和央求的口吻（我推着你去走走？你要是愿意，就明天？），甚至有些絮叨（回忆豌豆黄儿、杨树花）。这完全符合一位深爱儿子、在儿子面前姿态卑微、急于用一切话题拉近关系的慈母身份，真实、自然，感人至深。",
                        source: "课文分析",
                      },
                      {
                        title: "语言描写：我的语言特点",
                        content:
                          "特点是暴戾（我可活什么劲！）、简短粗暴（不，我不去！）、不耐烦（哎呀，烦不烦？）。真实反映了残疾初期一个青年内心的风暴与对世界的抗拒。",
                        source: "课文分析",
                      },
                      {
                        title: "神态描写：眼边儿红红的",
                        content:
                          "极其简洁的一笔。它告诉我们，母亲在门外听着儿子发泄时，自己也在默默流泪。强忍悲痛进来面对儿子，却藏不住哭过的痕迹。这一细节，无声地揭示了母亲内心承受的巨大痛苦，以及她在儿子面前强作镇定的坚强。",
                        source: "课文第1段",
                      },
                      {
                        title: "神态描写：她憔悴的脸上现出央求般的神色",
                        content:
                          "憔悴是病容，是身体被疾病消耗的结果；央求般的神色是表情，是为了儿子放下尊严的心理流露。两者叠加，刻画出一张令人心碎的面孔——一个自身濒临死亡的人，却在乞求儿子要活下去。",
                        source: "课文第3段",
                      },
                      {
                        title: "细节描写（综合运用）",
                        content:
                          "上述动作、语言、神态描写，均是极其成功的细节描写。它们如同电影中的特写镜头，放大了人物在特定时刻最真实、最细微的反应和状态。正是这些具体的、可感的细节，而不是抽象的概括，使人物形象血肉丰满、跃然纸上，使情感表达具体真切、直抵人心，构成了文章感人力量的基石。",
                        source: "写作手法",
                      },
                    ],
                    teachingTips:
                      "引导学生找出关键动词，分析其表达效果，并尝试仿写",
                  },
                  {
                    id: "environment-description",
                    label: "环境/景物描写",
                    level: "重点知识点",
                    difficulty: 4,
                    category: "文本鉴赏与表达 > 语言技巧",
                    description:
                      "分析景物描写的作用：烘托、推动情节、营造氛围、象征",
                    examples: [
                      {
                        title: "窗外的树叶唰唰啦啦地飘落",
                        content:
                          "①手法：景物描写，融情于景。②作用：烘托人物心情——萧瑟的秋景，飘零的落叶，形象地烘托出我当时内心的凄凉、孤寂、绝望，以及对生命凋零的同病相怜之感。推动情节发展——正因为我在看着这片伤感的景象发呆，母亲才挡在窗前，并顺势提出去看菊花，从而推动了后续情节的发展。营造全文氛围——为整个故事奠定了感伤、沉重、带有悲剧色彩的基调。",
                        source: "课文第3段",
                      },
                      {
                        title: "结尾对北海菊花的描写",
                        content:
                          "是情景交融、托物寓意的典范，将描写从烘托提升到了象征的高度。菊花的色彩（黄色淡雅、白色高洁、紫红热烈深沉）和姿态（泼泼洒洒、烂漫）象征母亲品格和生命力，以及好好儿活的理想状态。",
                        source: "课文第7段",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "expression-technique",
            label: "表现手法",
            level: "核心知识点",
            difficulty: 4,
            category: "文本鉴赏与表达 > 语言技巧",
            description: "掌握衬托、留白、象征等表现手法的运用",
            examples: [
              {
                title: "衬托：以我的暴怒绝望，反衬母亲的隐忍坚韧",
                content:
                  "我越是砸东西、摔东西、喊活什么劲，母亲悄悄地躲出去、忍住哭声说好好儿活的形象就越显高大、悲情与伟大。儿子的动与母亲的静，儿子的爆发与母亲的内敛，形成强烈对比。",
                source: "写作手法",
              },
              {
                title: "衬托：以美好事物反衬我的痛苦",
                content:
                  "天上北归的雁阵（自由、有序的美好）、李谷一甜美的歌声（艺术、愉悦的美好），这些在常人看来能带来享受的事物，在我眼中却成了刺激源，引发更暴烈的行为。这反而更深刻地衬托出我内心痛苦之深、对正常生活渴望而不可得的绝望之甚。",
                source: "写作手法",
              },
              {
                title: "留白：母亲未说完的遗言",
                content:
                  "我那个有病的儿子和我那个还未成年的女儿……话未说完，便用省略号戛然而止。艺术效果：①激发读者想象，参与创作。②符合真实情境——昏迷之际，生命垂危，气息奄奄，说话断续、无法说完。③强化悲剧感染力——连一句完整的遗言都无法留下，更增添了命运的残酷。④极致突出牵挂——即便在意识即将消散的边缘，思维碎片中最清晰、最执念的仍是两个需要她庇护的孩子。",
                source: "课文第6段",
              },
              {
                title: "象征：菊花的象征",
                content:
                  "象征母亲的品格（淡雅、高洁、热烈深沉）、顽强的生命力，以及母亲对儿子的生命期望。",
                source: "意象分析",
              },
              {
                title: "象征：秋天的象征",
                content:
                  "象征生命的成熟期、情感的沉淀期，也承载着凋零与收获、死亡与领悟的双重意味。",
                source: "意象分析",
              },
            ],
          },
          {
            id: "language-style",
            label: "语言风格",
            level: "重点知识点",
            difficulty: 3,
            category: "文本鉴赏与表达 > 语言技巧",
            description: "理解文章质朴平实、含蓄深沉的语言风格",
            examples: [
              {
                title: "总体风格",
                content: "质朴平实，含蓄深沉，在冷静克制的叙述中蕴含强烈情感。",
                source: "语言分析",
              },
              {
                title: "词汇特点",
                content:
                  "多用家常口语、朴素词汇，几乎没有华丽的形容词和复杂的句式。",
                source: "语言分析",
              },
              {
                title: "叙事语调",
                content:
                  "平静、内敛、舒缓，如同一个人沉静地回忆往事。即使写到母亲吐血离世这样的惨烈场景，也用她出去了，就再也没回来这样极简、冷静的句子处理，将巨大的悲痛压在文字之下。",
                source: "语言分析",
              },
              {
                title: "抒情方式",
                content:
                  "间接抒情为主，情感如地下暗河，在平静的叙述地表下汹涌奔腾。作者不直接呼喊，而是通过对细节的呈现，让读者自己感受到那份惊心动魄的情感。这种于无声处听惊雷的风格，更符合回忆性散文内敛、沉思的特质，也使得情感表达更为厚重、真诚，富有直击人心的力量。",
                source: "语言分析",
              },
            ],
          },
          {
            id: "rhetoric",
            label: "修辞手法",
            level: "基础知识点",
            difficulty: 2,
            category: "文本鉴赏与表达 > 语言技巧",
            description: "理解反复修辞手法的运用",
            examples: [
              {
                title: "反复：好好儿活，好好儿活……",
                content:
                  "语言的反复。在母亲的语言中特意重复，起强调作用，强化了这句话作为全文核心主旨的地位，表达了母亲恳切到近乎哀求的语气与坚定不移的信念。",
                source: "课文第1段",
              },
            ],
          },
          {
            id: "word-analysis",
            label: "词语品析",
            level: "核心知识点",
            difficulty: 4,
            category: "文本鉴赏与表达 > 语言技巧",
            description: "品析叠词、动词、副词的表达效果",
            examples: [
              {
                title: "叠词：悄悄地、偷偷地",
                content:
                  "增强动作的轻盈感、持续性和隐蔽性，形象地写出母亲生怕惊扰我的心理状态，生动表现其细心、体贴与极致的隐忍。",
                source: "词语分析",
              },
              {
                title: "叠词：泼泼洒洒",
                content:
                  "形容菊花开放得繁盛、无拘无束、淋漓尽致的样子，富有生动的画面感和动态美，象征了生命应有的奔放、洒脱与热烈。",
                source: "词语分析",
              },
              {
                title: "叠词：絮絮叨叨",
                content:
                  "模拟了母亲因一时高兴、急于分享往事而话多、来回说的状态，充满浓厚的生活气息，生动传神地刻画出母亲当时兴奋、略带慌乱的心理。",
                source: "词语分析",
              },
              {
                title: "动词：扑、抓",
                content:
                  "迅疾、有力、充满张力，表现母亲在危急关头的瞬间爆发出的急切情感与巨大力量。",
                source: "词语分析",
              },
              {
                title: "动词：挡",
                content:
                  "一个主动的、带有明确保护意识的动作，凝聚了母爱的全部本能与深情，是全文的诗眼之一。",
                source: "词语分析",
              },
              {
                title: "动词：捶打",
                content:
                  "表现了我对残疾双腿的憎恨、对命运不公的愤怒，动作充满自毁倾向和无力感。",
                source: "词语分析",
              },
              {
                title: "副词：一直、再也、绝、竟",
                content:
                  "这些副词在表情达意上起着画龙点睛、强化程度的关键作用。它们将时间、语气、出乎意料的程度强化到极致，深刻而精准地揭示了人物复杂、微妙、激烈的情感活动，是语言高度提炼的体现。",
                source: "词语分析",
              },
            ],
            teachingTips: "引导学生找出关键副词，分析其强化情感的作用",
          },
        ],
      },
    ],
  },
  {
    id: "learning-methods",
    label: "学习方法与策略",
    icon: Reading,
    color: "#909399",
    children: [
      {
        id: "reading-methods",
        label: "阅读方法",
        icon: ChatDotRound,
        color: "#67c23a",
        level: "方法指导",
        difficulty: 2,
        category: "学习方法与策略",
        description:
          "掌握朗读法、文本细读法、比较联读法、联系生活体验法、批注阅读法",
        examples: [
          {
            title: "朗读法：重要性",
            content:
              "本文情感深沉内敛，语言富有节奏和张力，是训练有感情朗读的典范文本。通过朗读，可以化无声文字为有声语言，直接体味语言的轻重缓急，感受情感的起伏流淌，是深入理解文本的必由之路。",
            source: "阅读方法",
          },
          {
            title: "朗读法：操作要点",
            content:
              "①把握整体感情基调：以深沉、舒缓、怀念为基调。②注意语气、语调的细致变化：读我的话用急促、烦躁、嘶哑甚至带点哭腔；读母亲的话用轻柔、低沉、充满恳求与克制；读叙述和抒情部分用沉稳、舒缓、平静中蕴含力量。③处理好重音、停连：重音落在关键动词（扑、抓、挡）、副词（一直、再也、绝）和反复出现的词语（好好儿活）上。",
            source: "朗读指导",
          },
          {
            title: "文本细读法",
            content:
              "摒弃浮光掠影的阅读，紧扣文本字、词、句、段，进行精细入微的品析。对重点词句进行圈点、批注，反复揣摩，多问几个为什么：为什么用这个词而不用那个？这句话背后藏着人物怎样的心理？这个细节有何深意？通过咬文嚼字，挖掘文本的深层内涵。",
            source: "阅读方法",
          },
          {
            title: "比较联读法",
            content:
              "将本文与史铁生的其他作品，特别是《合欢树》、《我与地坛》（节选）进行关联阅读。寻找共同的主题（如母爱、苦难、生死）、相似的情感（怀念、愧疚）、互文的情节或细节。通过比较，更全面地把握史铁生的创作风格、思想脉络和情感世界。",
            source: "阅读方法",
          },
          {
            title: "联系生活体验法",
            content:
              "在理解文本的基础上，反观自身生活。引导思考：文中的母爱是否让你联想到自己父母或长辈的关爱？你是否曾因专注于自己的烦恼而忽略过亲人的付出？你如何理解自己生活中的好好儿活？通过建立文本与个人经验的联系，使阅读产生真正的共鸣、反思与教育意义。",
            source: "阅读方法",
          },
          {
            title: "批注阅读法",
            content:
              "在阅读过程中，随时在字里行间或页边空白处，用简短的文字写下自己的疑问、感悟、赏析、评价。可以是对一个词的品味，对一句话的理解，对一种写法的看法。这是进行深度阅读、形成个人见解的有效辅助手段和习惯。",
            source: "阅读方法",
          },
        ],
        relatedMaterials: ["朗读音频", "批注示例", "阅读方法卡片"],
        teachingTips:
          "结合朗读和批注实践，引导学生多角度深入文本，建立文本与生活的联系",
      },
    ],
  },
]);

const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.label.includes(value);
};

const handleNodeClick = (data: any) => {
  if (data.children && data.children.length > 0) {
    return;
  }
  selectedNode.value = data;
};

const getLevelType = (level: string) => {
  const typeMap: Record<string, any> = {
    核心知识点: "danger",
    重点知识点: "warning",
    难点知识点: "danger",
    基础知识点: "info",
  };
  return typeMap[level] || "info";
};

watch(searchKeyword, (val) => {
  treeRef.value?.filter(val);
});
</script>

<style scoped lang="scss">
.knowledge-system-view {
  .page-header {
    margin-bottom: 24px;
    padding: 24px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    h1 {
      margin: 0 0 8px 0;
      color: #1a2332;
      font-size: 28px;
    }

    .subtitle {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
  }

  .content-wrapper {
    .tree-card,
    .detail-card {
      height: calc(100vh - 200px);

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        font-weight: bold;
      }
    }

    .tree-card {
      :deep(.el-card__body) {
        padding: 12px;
        overflow-y: auto;
        height: calc(100% - 60px);
      }
    }

    .detail-card {
      :deep(.el-card__body) {
        overflow-y: auto;
        height: calc(100% - 60px);
      }
    }

    .tree-node {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      padding: 4px 0;
    }

    .knowledge-detail {
      .examples-section,
      .materials-section,
      .tips-section {
        margin-top: 24px;

        h3 {
          color: #1a2332;
          margin-bottom: 16px;
          font-size: 16px;
        }

        p {
          line-height: 1.8;
          color: #666;
        }
      }
    }
  }
}
</style>

const departments = [
  {
    name: "収束部門",
    tag: "Convergence",
    description:
      "海蝕現象の前線に立つ部門。モジュールと呼ばれる収束装置を携行し、現場での即応処置を行う。",
  },
  {
    name: "支援部門",
    tag: "Support",
    description:
      "現地オペレーションの調整やデータ解析、海蝕員の帰還後ケアを担当。状況に応じて現場への同行支援も実施する。",
  },
  {
    name: "工作部門",
    tag: "Engineering",
    description:
      "回収された海蝕実体や残滓を検証し、その特性をモジュールへ転用する。部室・消耗品・小物類の製作も兼任。",
  },
  {
    name: "外事部門",
    tag: "External",
    description:
      "行政・報道機関・階底次元住民との折衝やメディア操作を行う。スカウトや経理に類似した業務を担当することもある。",
  },
  {
    name: "港湾部門",
    tag: "Harbor",
    description:
      "境界の入り口となる土地や施設を24時間監視し、未認可の不根や海蝕実体の侵入を阻止する。",
  },
];

const keywords = [
  {
    label: "残滓",
    detail: "収束後に残る異質な物質・エネルギーの結晶。モジュール材料として重要。",
  },
  {
    label: "階宙次元",
    detail: "我々の次元を包括する異常次元。僅かな可能性を拡大し、新たな世界を生み出す。",
  },
  {
    label: "階底次元",
    detail: "階宙次元内で現在存在している次元を相対的に表した呼称。",
  },
];

const glossary = [
  {
    term: "海蝕実体",
    description:
      "海蝕現象が次元世界で実体化したもの。意思や概念など通常は実体を持たないものも具現化する。",
  },
  {
    term: "不根",
    description:
      "特定の次元に定在せず渡り歩く存在の総称。多種多様な種族が入り混じる。",
  },
];

const departmentContainer = document.getElementById("department-list");
const keywordContainer = document.getElementById("keyword-grid");
const glossaryContainer = document.getElementById("glossary-list");

const buildDepartment = (dept, index) => {
  const article = document.createElement("article");
  article.className = "department";
  article.dataset.open = index === 0 ? "true" : "false";

  const header = document.createElement("div");
  header.className = "department__header";

  const title = document.createElement("span");
  title.className = "department__title";
  title.textContent = dept.name;

  const tag = document.createElement("span");
  tag.className = "department__tag";
  tag.textContent = dept.tag;

  const body = document.createElement("p");
  body.className = "department__body";
  body.textContent = dept.description;

  header.appendChild(title);
  header.appendChild(tag);
  article.appendChild(header);
  article.appendChild(body);

  article.addEventListener("click", () => {
    const isOpen = article.dataset.open === "true";
    article.dataset.open = isOpen ? "false" : "true";
  });

  return article;
};

const buildKeyword = (keyword) => {
  const card = document.createElement("div");
  card.className = "keyword";

  const label = document.createElement("span");
  label.textContent = keyword.label;

  const detail = document.createElement("p");
  detail.textContent = keyword.detail;

  card.appendChild(label);
  card.appendChild(detail);
  return card;
};

const buildGlossary = (item) => {
  const wrapper = document.createElement("div");
  wrapper.className = "glossary-item";

  const title = document.createElement("h4");
  title.textContent = item.term;

  const description = document.createElement("p");
  description.textContent = item.description;

  wrapper.appendChild(title);
  wrapper.appendChild(description);
  return wrapper;
};

departments.forEach((dept, index) => {
  departmentContainer.appendChild(buildDepartment(dept, index));
});

keywords.forEach((keyword) => {
  keywordContainer.appendChild(buildKeyword(keyword));
});

glossary.forEach((item) => {
  glossaryContainer.appendChild(buildGlossary(item));
});

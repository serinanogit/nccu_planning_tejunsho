"use client";

import { useEffect, useMemo, useState } from "react";

type Chapter = "cover" | "hiring" | "checkin" | "work" | "salary";
type Identity = "single" | "internal" | "external" | "both";
type OfficeTeam = "planning" | "topu";
type OfficePerson = {
  id: string;
  name: string;
  title: string;
  extension: string;
  team: OfficeTeam;
  summary: string;
  duties: string[];
  isAssistant?: boolean;
};
type HandbookDocument = {
  id: string;
  name: string;
  copies: string;
  system: boolean;
  preview: string | null;
  previewPages?: string[];
  note: string | null;
  href: string | null;
  linkLabel: string | null;
  downloadHref?: string;
  downloadName?: string;
};

const chapters: Array<{ id: Chapter; number: string; label: string; color: string; tabLines?: string[] }> = [
  { id: "cover", number: "", label: "封面", color: "#ded7c8" },
  { id: "hiring", number: "01", label: "進用", color: "#e7bd56" },
  { id: "checkin", number: "02", label: "簽到", color: "#e9cfa0" },
  { id: "work", number: "03", label: "工作百寶袋", tabLines: ["工作", "百寶袋"], color: "#9db9ad" },
  { id: "salary", number: "04", label: "薪資", color: "#8da7bf" },
];

const workSections = [
  { id: "work-role", emoji: "🧭", title: "企畫組的工作是什麼？" },
  { id: "work-registration", emoji: "📝", title: "活動報名系統" },
  { id: "work-event-sop", emoji: "🎪", title: "辦理活動 SOP" },
  { id: "work-tools", emoji: "🧰", title: "平常使用的工具" },
  { id: "work-tips", emoji: "💡", title: "工作補帖與常見提醒" },
];

const officePeople: OfficePerson[] = [
  {
    id: "assistant",
    name: "企畫組兼任助理",
    title: "你本人",
    extension: "62612",
    team: "planning",
    summary: "電話代接及企畫組行政協助",
    duties: ["代接、轉接辦公室電話並留下完整留言", "協助企畫組日常行政業務"],
    isAssistant: true,
  },
  {
    id: "wang",
    name: "王芷容",
    title: "專案經理",
    extension: "62759",
    team: "planning",
    summary: "UAAT、研發業務推展及專案企劃",
    duties: ["辦理教育部國家重點領域國際合作聯盟（UAAT）相關事宜", "協辦研究發展相關業務推展", "專案企劃、執行及提案簡報"],
  },
  {
    id: "yeh",
    name: "葉致緯",
    title: "一級行政專員",
    extension: "62769",
    team: "planning",
    summary: "高教論壇、大型專案、國際學術合作及研發電子報",
    duties: ["高等教育趨勢論壇、大型或新型專案及諾貝爾大師論壇", "境內外校級學術合作、研究聯盟協議及 UAAT", "百年政大發展計畫、研發電子報及研發處行政庶務"],
  },
  {
    id: "kuo",
    name: "郭重言",
    title: "資深行政秘書",
    extension: "62608",
    team: "planning",
    summary: "研發專案、高教深耕窗口、對外文稿及資訊設備",
    duties: ["新專案與大型專案的規劃、申請及執行", "研發處高教深耕窗口及資料彙辦", "對外文稿與公關、資訊安全及電腦軟硬體管理", "研發替代役及校外重要學術活動公告"],
  },
  {
    id: "hung",
    name: "洪芷漪",
    title: "組長",
    extension: "62755",
    team: "planning",
    summary: "綜理企畫組行政業務",
    duties: ["協助綜理企畫組行政業務"],
  },
  {
    id: "tai",
    name: "戴嘉賢",
    title: "專員",
    extension: "66885",
    team: "topu",
    summary: "高教深耕總窗口、執行策略、年度經費及綜合行政",
    duties: ["高教深耕計畫總窗口及年度重要專案進度追蹤", "計畫執行策略、年度經費規劃與控管", "經費請撥、結報、滾存及管考平台資料填報", "計畫人事規範、助理續聘及深耕辦綜合業務"],
  },
  {
    id: "hsieh",
    name: "謝宜君",
    title: "專案經理",
    extension: "62748",
    team: "topu",
    summary: "高教深耕計畫書、績效管考、訪視、平台及簡報",
    duties: ["高教深耕計畫執行策略與計畫書撰寫修訂", "績效指標、成果報告、考評及訪視", "學院計畫審議與經費核定、管考平台規劃", "計畫簡報及教育部工作圈會議"],
  },
];

const baseDocuments: HandbookDocument[] = [
  { id: "arrival", name: "計畫兼任助理報到程序表", copies: "印 1 份（只需印第 1 頁）", system: false, preview: "assets/doc-previews/arrival.png", note: null, href: null, linkLabel: null, downloadHref: "assets/forms/arrival-procedure-form.doc", downloadName: "計畫兼任助理報到程序表.doc" },
  { id: "appointment", name: "進用單", copies: "印 1 份", system: true, preview: "assets/doc-previews/appointment/page-1.jpg", previewPages: ["assets/doc-previews/appointment/page-1.jpg", "assets/doc-previews/appointment/page-2.jpg", "assets/doc-previews/appointment/page-3.jpg"], note: null, href: null, linkLabel: null },
  { id: "contract", name: "計畫兼任助理定期勞動契約書", copies: "印 3 份", system: true, preview: "assets/doc-previews/contract/page-1.jpg", previewPages: ["assets/doc-previews/contract/page-1.jpg", "assets/doc-previews/contract/page-2.jpg"], note: "提醒｜送交人事室第四組前，先至行政大樓 5 樓總務處文書組辦理契約書用印。", href: null, linkLabel: null },
  { id: "description", name: "計畫兼任助理工作說明書", copies: "印 1 份", system: false, preview: "assets/doc-previews/description/page-1.jpg", previewPages: ["assets/doc-previews/description/page-1.jpg", "assets/doc-previews/description/page-2.jpg"], note: null, href: null, linkLabel: null, downloadHref: "assets/forms/job-description-form.doc", downloadName: "計畫兼任助理工作說明書.doc" },
  { id: "relationship", name: "計畫兼任助理勞動型關係認定表", copies: "印 4 份", system: false, preview: "assets/doc-previews/relationship/example.jpg", previewPages: ["assets/doc-previews/relationship/example.jpg"], note: null, href: null, linkLabel: null, downloadHref: "assets/forms/labor-relationship-form.docx", downloadName: "計畫兼任助理勞動型關係認定表.docx" },
  { id: "pension", name: "提繳勞工退休金比例同意書", copies: "印 1 份", system: true, preview: null, note: null, href: null, linkLabel: null },
  { id: "health", name: "健保投保確認申請表", copies: "印 1 份", system: true, preview: null, note: null, href: null, linkLabel: null },
  { id: "enrollment", name: "在學證明", copies: "印 1 份", system: false, preview: null, note: null, href: "https://moltke.nccu.edu.tw/sturegcert_SSO/index.jsp", linkLabel: "申請在學證明" },
  { id: "funding", name: "經費核定清單", copies: "向進用窗口(致緯哥)索取", system: false, preview: null, note: null, href: null, linkLabel: null },
];

const safetySteps = [
  { text: "一般職業安全衛生教育訓練課程（上）", href: "https://isafeel.osha.gov.tw/info/10000045" },
  { text: "一般職業安全衛生教育訓練課程（下）", href: "https://isafeel.osha.gov.tw/info/10000056" },
  { text: "至「個人專區 → 學習履歷 → 列印學習紀錄」下載學習時數證明。" },
  { text: "列印並填寫教育訓練證明單的基本資料，將學習時數證明附在證明單後面，再交給進用窗口(致緯哥)確認實體課程欄位及主管簽章。" },
];

const salaryDocuments = [
  {
    id: "attendance",
    name: "出勤紀錄單",
    preview: "assets/salary/attendance/example/1.jpg",
    previewPages: ["assets/salary/attendance/example/1.jpg", "assets/salary/attendance/example/2.jpg"],
  },
  {
    id: "appointment-proof",
    name: "進用證明單",
    preview: "assets/salary/appointment/example/1.jpg",
    previewPages: ["assets/salary/appointment/example/1.jpg"],
  },
  {
    id: "payroll",
    name: "薪資清冊",
    preview: "assets/salary/payroll/example/1.jpg",
    previewPages: ["assets/salary/payroll/example/1.jpg"],
  },
];

function CheckItem({ id, checked, onChange, children }: {
  id: string;
  checked: boolean;
  onChange: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className={`check-item ${checked ? "is-checked" : ""}`}>
      <input type="checkbox" checked={checked} onChange={() => onChange(id)} />
      <span className="custom-check" aria-hidden="true">{checked ? "✓" : ""}</span>
      <span>{children}</span>
    </label>
  );
}

function SalaryStep({ number, title, image, imageAlt, onOpen, children, note }: {
  number: number;
  title: string;
  image: string;
  imageAlt: string;
  onOpen: () => void;
  children: React.ReactNode;
  note?: React.ReactNode;
}) {
  return (
    <article className="salary-step-card">
      <div className="salary-step-copy">
        <span className="salary-step-number">{String(number).padStart(2, "0")}</span>
        <div>
          <h3>{title}</h3>
          <div className="salary-step-description">{children}</div>
          {note && <aside className="salary-inline-note"><strong>提醒</strong>{note}</aside>}
        </div>
      </div>
      <button className="salary-step-image" onClick={onOpen} aria-label={`放大查看步驟 ${number}：${title}`}>
        <img src={image} alt={imageAlt} />
        <span>步驟 {number} 操作畫面｜點圖放大</span>
      </button>
    </article>
  );
}

function PhoneMemo({ compact = false, printable = false }: { compact?: boolean; printable?: boolean }) {
  return (
    <article className={`phone-note-sheet ${compact ? "compact" : ""} ${printable ? "printable" : ""}`}>
      {!printable && <span className="phone-note-tape" aria-hidden="true" />}
      {!printable && (
        <header>
          <span>🗒️</span>
          <div><small>電話代接</small><strong>留言格式</strong></div>
        </header>
      )}
      <div className="phone-note-datetime">
        <span><small>日期</small>20XX.XX.XX</span>
        <span><small>時間</small>XX:XX</span>
      </div>
      {!printable && <p className="phone-note-warning">日期與時間務必填寫，看到留言的人才能依來電先後順序安排回電。</p>}
      <dl>
        <div><dt>來電單位</dt><dd>○○大學／○○公司／○○處室</dd></div>
        <div><dt>來電者</dt><dd>○先生／○小姐／○組長／○主任／○秘書</dd></div>
        <div><dt>聯絡方式</dt><dd>09XXXXXXXX／分機 XXXXX</dd></div>
        <div><dt>來電事項</dt><dd>詢問○○○○○○</dd></div>
        <div><dt>後續處理</dt><dd>請回電／其他：＿＿＿＿＿＿</dd></div>
      </dl>
    </article>
  );
}

function OfficeMiniSeat({ id }: { id: string }) {
  const person = officePeople.find((item) => item.id === id)!;
  return (
    <div className={`office-mini-seat ${person.team} ${person.isAssistant ? "is-you" : ""}`}>
      <small>{person.title}</small>
      <strong>{person.name}</strong>
      <b>☎️ 分機 {person.extension}</b>
      <p>{person.summary}</p>
    </div>
  );
}

function OfficeDeskCard() {
  return (
    <div className="office-desk-card" aria-label="辦公室座位與分機小抄">
      <header>
        <div><small>企畫組兼任助理</small><strong>座位與分機小抄</strong></div>
        <span>🗺️</span>
      </header>
      <div className="office-mini-map">
        <div className="office-mini-top">
          <div className="office-mini-door"><span>🚪</span><strong>門口</strong></div>
          <OfficeMiniSeat id="wang" />
          <div className="office-mini-meeting"><span>○</span><strong>圓桌</strong><small>兩張椅子</small></div>
          <OfficeMiniSeat id="yeh" />
          <OfficeMiniSeat id="kuo" />
        </div>
        <div className="office-mini-lower">
          <div className="office-mini-horizontal-corridor" aria-label="橫向走廊"><strong>走廊</strong></div>
          <div className="office-mini-stack"><OfficeMiniSeat id="assistant" /><OfficeMiniSeat id="hsieh" /></div>
          <div className="office-mini-corridor"><span>走廊</span><b>✂️ 裁紙機、電動訂書機</b></div>
          <div className="office-mini-right"><OfficeMiniSeat id="tai" /><OfficeMiniSeat id="hung" /></div>
        </div>
      </div>
      <footer><span className="planning">企畫組</span><span className="topu">高教深耕計畫辦公室</span><span className="you">你本人</span></footer>
    </div>
  );
}

function OfficeSeat({ person, positionClass, onSelect }: {
  person: OfficePerson;
  positionClass: string;
  onSelect: (id: string) => void;
}) {
  return (
    <button className={`office-seat ${person.team} ${person.isAssistant ? "is-you" : ""} ${positionClass}`} onClick={() => onSelect(person.id)} aria-label={`查看${person.name}的業務`}>
      <small>{person.title}</small>
      <strong>{person.name}</strong>
      <b>☎️ 分機 {person.extension}</b>
      <p>{person.summary}</p>
      <span className="seat-more">點擊查看業務</span>
    </button>
  );
}

export default function Home() {
  const [chapter, setChapter] = useState<Chapter>("cover");
  const [identity, setIdentity] = useState<Identity>("single");
  const [insuredElsewhere, setInsuredElsewhere] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [lightbox, setLightbox] = useState<string[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [copiedInccu, setCopiedInccu] = useState(false);
  const [phoneMemoOpen, setPhoneMemoOpen] = useState(false);
  const [officeMapCardOpen, setOfficeMapCardOpen] = useState(false);
  const [officePersonId, setOfficePersonId] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("nccu-handbook-progress");
    const savedIdentity = window.localStorage.getItem("nccu-handbook-identity");
    const savedInsurance = window.localStorage.getItem("nccu-handbook-insured-elsewhere");
    if (saved) setChecked(JSON.parse(saved));
    if (savedIdentity === "single" || savedIdentity === "internal" || savedIdentity === "external" || savedIdentity === "both") setIdentity(savedIdentity);
    if (savedIdentity === "concurrent") setIdentity("internal");
    if (savedInsurance === "true") setInsuredElsewhere(true);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("nccu-handbook-progress", JSON.stringify(checked));
    window.localStorage.setItem("nccu-handbook-identity", identity);
    window.localStorage.setItem("nccu-handbook-insured-elsewhere", String(insuredElsewhere));
  }, [checked, identity, insuredElsewhere, hydrated]);

  useEffect(() => {
    if (!lightbox) return;
    function handleLightboxKey(event: KeyboardEvent) {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowLeft") setLightboxIndex((index) => (index - 1 + lightbox.length) % lightbox.length);
      if (event.key === "ArrowRight") setLightboxIndex((index) => (index + 1) % lightbox.length);
    }
    window.addEventListener("keydown", handleLightboxKey);
    return () => window.removeEventListener("keydown", handleLightboxKey);
  }, [lightbox]);

  useEffect(() => {
    if (!phoneMemoOpen && !officeMapCardOpen && !officePersonId) return;
    function handleDialogKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPhoneMemoOpen(false);
        setOfficeMapCardOpen(false);
        setOfficePersonId(null);
      }
    }
    window.addEventListener("keydown", handleDialogKey);
    return () => window.removeEventListener("keydown", handleDialogKey);
  }, [phoneMemoOpen, officeMapCardOpen, officePersonId]);

  const documents = useMemo(
    () => identity === "internal" || identity === "both"
      ? [...baseDocuments, { id: "insurance-share", name: "保險費經費分攤同意書", copies: "印 1 份", system: false, preview: null, note: null, href: null, linkLabel: null, downloadHref: "assets/forms/insurance-cost-sharing-form.doc", downloadName: "兼任多職務保險費分攤同意書.doc" }]
      : baseDocuments,
    [identity],
  );

  const allChecklistIds = [
    ...documents.map((doc) => `doc-${doc.id}`),
    ...safetySteps.map((_, index) => `safety-${index}`),
  ];
  const completedCount = allChecklistIds.filter((id) => checked[id]).length;
  const progress = allChecklistIds.length ? Math.round((completedCount / allChecklistIds.length) * 100) : 0;
  const salaryChecklistIds = salaryDocuments.map((doc) => `salary-${doc.id}`);
  const salaryCompletedCount = salaryChecklistIds.filter((id) => checked[id]).length;
  const salaryProgress = Math.round((salaryCompletedCount / salaryChecklistIds.length) * 100);
  const selectedOfficePerson = officePeople.find((person) => person.id === officePersonId) ?? null;

  function toggle(id: string) {
    setChecked((previous) => ({ ...previous, [id]: !previous[id] }));
  }

  function changeChapter(next: Chapter) {
    setChapter(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openLightbox(pages: string | string[]) {
    setLightbox(Array.isArray(pages) ? pages : [pages]);
    setLightboxIndex(0);
  }

  async function copyInccuUrl() {
    const url = "https://i.nccu.edu.tw/Login.aspx";
    try {
      await window.navigator.clipboard.writeText(url);
      setCopiedInccu(true);
      window.setTimeout(() => setCopiedInccu(false), 2200);
    } catch {
      window.prompt("請複製 iNCCU 網址", url);
    }
  }

  function printDeskCard(className: "printing-phone-note" | "printing-office-map-card") {
    document.body.classList.add(className);
    const cleanup = () => document.body.classList.remove(className);
    window.addEventListener("afterprint", cleanup, { once: true });
    window.print();
    window.setTimeout(cleanup, 1500);
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark">
            <img src="assets/nccu-rnd-logo.png" alt="國立政治大學研究發展處標誌" />
          </span>
          <div>
            <p>國立政治大學｜研發處企畫組</p>
            <strong>兼任助理交接手冊</strong>
          </div>
        </div>
      </header>

      <div className="book-stage">
        <div className="book-shadow" aria-hidden="true" />
        <nav className="bookmark-tabs" aria-label="手冊章節">
          {chapters.map((item) => (
            <button key={item.id} className={chapter === item.id ? "active" : ""} style={{ "--tab-color": item.color } as React.CSSProperties} onClick={() => changeChapter(item.id)} aria-current={chapter === item.id ? "page" : undefined}>
              {item.number && <span className="bookmark-number">{item.number}</span>}
              <span className="bookmark-label">{(item.tabLines ?? [item.label]).map((line) => <span key={line}>{line}</span>)}</span>
            </button>
          ))}
        </nav>
        <article className={`book-page chapter-${chapter}`}>
          <div className="book-spine" aria-hidden="true" />

          {chapter === "cover" && (
            <section className="cover-page page-content">
              <div className="cover-kicker">HANDOVER HANDBOOK</div>
              <div className="cover-rule" />
              <p className="cover-department">國立政治大學研發處企畫組</p>
              <h1>兼任助理<br />交接手冊</h1>
              <div className="cover-illustration" aria-hidden="true">
                <img src="assets/cover-cats.png" alt="" />
              </div>
              <div className="cover-subtitle cover-message">
                <p>嗨～學弟 or 學妹，我是 YITING 🤗</p>
                <p>首先，恭喜你通過面試和上機考，你真的超棒 💯！歡迎你加入政大研發處企畫組 💫</p>
                <p>📖 這份手冊整理了我認為可能會對你入職有幫助的內容，希望多少能幫助到你 ☺️</p>
              </div>
              <button className="primary-button" onClick={() => changeChapter("hiring")}>
                開始閱讀 01 進用 <span aria-hidden="true">→</span>
              </button>
              <p className="page-number">01</p>
            </section>
          )}

          {chapter === "hiring" && (
            <section className="page-content handbook-page">
              <div className="chapter-heading">
                <div>
                  <p className="eyebrow">PART 01</p>
                  <h1>進用</h1>
                  <p>依序完成身分判斷、進用文件與一般安全衛生教育訓練。</p>
                </div>
                <div className="progress-card" aria-label={`進用進度 ${progress}%`}>
                  <span>{completedCount} / {allChecklistIds.length}</span><strong>{progress}%</strong>
                  <div className="progress-track"><i style={{ width: `${progress}%` }} /></div>
                  <small>勾選紀錄會保留在這台裝置</small>
                </div>
              </div>

              <nav className="section-nav" aria-label="進用章節目錄">
                <a href="#identity">身分判斷</a><a href="#appointment-system">進用系統</a><a href="#documents">文件清單</a><a href="#safety">安全衛生教育訓練</a>
              </nav>

              <section id="identity" className="content-section">
                <div className="section-title"><span>1</span><div><p>先做這一步</p><h2>身分判斷</h2></div></div>
                <div className="identity-card">
                  <fieldset>
                    <legend>目前是否同時兼任其他助理或工讀？</legend>
                    <label className={identity === "single" ? "selected" : ""}>
                      <input type="radio" name="identity" checked={identity === "single"} onChange={() => { setIdentity("single"); setInsuredElsewhere(false); }} />
                      <span><strong>無兼任其他助理與工讀</strong><small>使用一般進用文件清單</small></span>
                    </label>
                    <label className={identity === "internal" ? "selected" : ""}>
                      <input type="radio" name="identity" checked={identity === "internal"} onChange={() => setIdentity("internal")} />
                      <span><strong>同時兼任校內其他兼任助理或工讀</strong><small>研究獎助生不算在內</small></span>
                    </label>
                    <label className={identity === "external" ? "selected" : ""}>
                      <input type="radio" name="identity" checked={identity === "external"} onChange={() => setIdentity("external")} />
                      <span><strong>同時兼任校外其他實習或工讀</strong></span>
                    </label>
                    <label className={identity === "both" ? "selected" : ""}>
                      <input type="radio" name="identity" checked={identity === "both"} onChange={() => setIdentity("both")} />
                      <span><strong>同時兼任校內與校外其他助理、實習或工讀</strong><small>研究獎助生不算在內</small></span>
                    </label>
                  </fieldset>
                  {identity !== "single" && (
                    <div className="follow-up"><label><input type="checkbox" checked={insuredElsewhere} onChange={(event) => setInsuredElsewhere(event.target.checked)} />其他工讀單位或公司已為我投保健保</label></div>
                  )}
                  <div className="insurance-summary" aria-live="polite">
                    <div><span className="insurance-icon">勞</span><p><strong>勞保：強制投保</strong></p></div>
                    <div><span className="insurance-icon health">健</span><p>{insuredElsewhere && identity !== "single" ? (
                      <><strong>健保：可向 人事室 勞健保業務 承辦人 確認免在本職位投保</strong><br />只有同時兼任其他工讀，且該單位已協助投保健保，才可不在本職位提撥。</>
                    ) : (
                      <strong>健保：需辦理投保</strong>
                    )}</p></div>
                  </div>
                </div>
              </section>

              <section id="documents" className="content-section">
                <div className="section-title"><span>2</span><div><p>報到前先行填寫完成</p><h2>人事室進用文件清單</h2></div></div>
                <div id="appointment-system" className="system-guide">
                  <div className="system-guide-copy">
                    <p className="system-guide-kicker">進用系統操作</p>
                    <h3>先在系統建立本次進用資料</h3>
                    <ol>
                      <li>
                        <b>開啟進用系統</b>
                        <span>點選左側「高教深耕／雙語計畫」，不要從其他類別進入。</span>
                        <button className="system-step-image" onClick={() => openLightbox("assets/doc-previews/system-guide-1.jpg")} aria-label="放大查看高教深耕／雙語計畫入口">
                          <img src="assets/doc-previews/system-guide-1.jpg" alt="政大進用系統首頁，以紅框標示高教深耕／雙語計畫入口" />
                          <span>操作畫面 1｜點圖放大</span>
                        </button>
                      </li>
                      <li className="system-plan-step">
                        <b>選擇計畫</b>
                        <span>請先跟進用窗口(致緯哥)確認以下資訊，再輸入中文姓名、英文姓名與身分證字號。</span>
                        <dl className="system-plan-values">
                          <div><dt>學院／系所</dt><dd>R00 研究發展處</dd></div>
                          <div><dt>計畫主持人</dt><dd>研發長 <small>114-2 學期：107954／徐士勛</small></dd></div>
                          <div><dt>計畫編號</dt><dd>115H111-01／115H111-01 學術研究國際接軌計畫</dd></div>
                        </dl>
                        <em className="annual-code-note">每年計畫代碼會變：基本格式為「民國年＋H111-01」，例如 116 年為 116H111-01。請以進用窗口(致緯哥)提供的當年度選項為準。</em>
                        <button className="system-step-image" onClick={() => openLightbox("assets/doc-previews/system-guide-2.jpg")} aria-label="放大查看計畫選擇欄位">
                          <img src="assets/doc-previews/system-guide-2.jpg" alt="政大進用系統計畫選擇畫面，以紅框標示學院系所、計畫主持人及計畫編號" />
                          <span>操作畫面 2｜點圖放大</span>
                        </button>
                      </li>
                      <li><b>填寫資料</b><span>填寫聘期、計畫名稱、執行單位、工作內容、薪資及勞健保／退休金資料；計畫或聘期若有疑問先問進用窗口(致緯哥)。</span></li>
                      <li><b>列印文件</b><span>由系統產出進用單、定期勞動契約書、退休金比例同意書及健保投保確認申請表，再依清單份數列印。</span></li>
                    </ol>
                    <a className="system-link" href="https://schwebap.nccu.edu.tw/pawb01/tempmenu.aspx" target="_blank" rel="noreferrer">開啟政大進用系統 <span aria-hidden="true">↗</span></a>
                  </div>
                </div>
                <div className="notice system-notice"><span>系統產生</span> 有此標籤的文件，請先由校內系統產出後再列印。</div>
                <div className="document-list document-grid">
                  {documents.map((doc, index) => (
                    <article key={doc.id} className={`document-card ${doc.preview ? "" : "without-preview"} ${checked[`doc-${doc.id}`] ? "is-checked" : ""}`}>
                      {doc.preview ? (
                        <button className={`document-thumb ${doc.id === "arrival" || doc.id === "appointment" || doc.id === "contract" || doc.id === "description" || doc.id === "relationship" ? "landscape-preview" : ""}`} onClick={() => openLightbox(doc.previewPages ?? doc.preview!)} aria-label={`放大查看${doc.name}${doc.previewPages ? `填寫範例，共 ${doc.previewPages.length} 張` : "去識別範例"}`}>
                          <img src={doc.preview} alt={`${doc.name}${doc.previewPages ? "填寫範例" : "去識別範例"}縮圖`} />
                          <span>{doc.previewPages ? `填寫範例・${doc.previewPages.length} 張` : "去識別範例"}</span>
                        </button>
                      ) : null}
                      <div className="document-card-body">
                        <div className="document-card-top"><span className="document-number">{String(index + 1).padStart(2, "0")}</span>{doc.system && <span className="system-badge">系統產生</span>}</div>
                        <strong>{doc.name}</strong>
                        <small>{doc.copies}</small>
                        {doc.note && <p className="document-note">{doc.note}</p>}
                        {doc.href && <a className="document-action" href={doc.href} target="_blank" rel="noreferrer">{doc.linkLabel} <span aria-hidden="true">↗</span></a>}
                        {doc.downloadHref && <a className="document-download" href={doc.downloadHref} download={doc.downloadName}>下載空白檔案 <span aria-hidden="true">↓</span></a>}
                        <label className="document-check">
                          <input type="checkbox" checked={Boolean(checked[`doc-${doc.id}`])} onChange={() => toggle(`doc-${doc.id}`)} />
                          <span className="custom-check" aria-hidden="true">{checked[`doc-${doc.id}`] ? "✓" : ""}</span>
                          已備妥
                        </label>
                      </div>
                    </article>
                  ))}
                </div>
                {(identity === "internal" || identity === "both") && <p className="conditional-note">已依你的身分自動加入「保險費經費分攤同意書」。</p>}
                <aside className="submission-location" aria-label="人事室進用文件繳交地點">
                  <span className="submission-pin" aria-hidden="true">📍</span>
                  <div>
                    <small>人事室進用文件清單｜完成後繳交</small>
                    <strong>行政大樓 6 樓・人事室第四組</strong>
                  </div>
                </aside>
              </section>

              <section id="safety" className="content-section">
                <div className="section-title"><span>3</span><div><p>報到前完成</p><h2>一般安全衛生教育訓練</h2></div></div>
                <p className="section-intro">企畫組兼任助理只需完成勞動部職業安全衛生數位學習平台的「上、下」兩門線上課程，再依下列步驟備齊文件。</p>
                <div className="safety-resources">
                  <div><strong>先從線上平台開始</strong><p>使用自己平常習慣的 Email 註冊即可。</p></div>
                  <div className="safety-resource-actions">
                    <a className="primary" href="https://isafeel.osha.gov.tw/mooc/index.php" target="_blank" rel="noreferrer">開啟線上課程平台 <span aria-hidden="true">↗</span></a>
                    <a href="assets/references/新進員工一般安全衛生教育訓練實施說明.pdf" target="_blank" rel="noreferrer">查看實施說明 PDF <span aria-hidden="true">↗</span></a>
                  </div>
                </div>
                <div className="safety-list">
                  {safetySteps.map((step, index) => (
                    <div key={step.text}>
                      <CheckItem id={`safety-${index}`} checked={Boolean(checked[`safety-${index}`])} onChange={toggle}>
                        <span className="step-text">
                          <b>{String(index + 1).padStart(2, "0")}</b>
                          {step.href ? (
                            <span>完成「<a href={step.href} target="_blank" rel="noreferrer">{step.text} <span aria-hidden="true">↗</span></a>」。</span>
                          ) : step.text}
                        </span>
                      </CheckItem>
                      {index === 2 && (
                        <figure className="screenshot-card">
                          <button onClick={() => openLightbox("assets/學習證明如何下載.jpg")} aria-label="放大查看學習證明下載操作截圖">
                            <img src="assets/學習證明如何下載.jpg" alt="職業安全衛生數位學習平台：由個人專區進入學習履歷，勾選課程後列印學習紀錄" /><span>點圖放大</span>
                          </button>
                          <figcaption><strong>操作截圖｜如何下載學習時數證明</strong><br />個人專區 → 學習履歷 → 勾選上、下兩門課程 → 列印學習紀錄</figcaption>
                        </figure>
                      )}
                      {index === 3 && (
                        <figure className="screenshot-card safety-form-card">
                          <button onClick={() => openLightbox("assets/環安教育證明單_實施日期範例.jpg")} aria-label="放大查看教育訓練證明單填寫範例">
                            <img src="assets/環安教育證明單_實施日期範例.jpg" alt="一般安全衛生教育訓練證明單橫式填寫範例，標示實施日期欄位" />
                            <span>點圖放大</span>
                          </button>
                          <figcaption><strong>填寫範例｜實施日期也要填寫</strong><br />原則上填報到日，請先問進用窗口(致緯哥)。</figcaption>
                        </figure>
                      )}
                    </div>
                  ))}
                </div>
                <aside className="submission-location safety-submission" aria-label="一般安全衛生教育訓練文件繳交地點">
                  <span className="submission-pin" aria-hidden="true">📍</span>
                  <div>
                    <small>一般安全衛生教育訓練文件｜完成後繳交</small>
                    <strong>行政大樓 5 樓・總務處環安組</strong>
                  </div>
                </aside>
              </section>

              <footer className="page-footer"><span>國立政治大學研發處企畫組｜兼任助理交接手冊</span><span>01 — 進用</span></footer>
            </section>
          )}

          {chapter === "checkin" && (
            <section className="page-content handbook-page checkin-page">
              <div className="chapter-heading">
                <div>
                  <p className="eyebrow">PART 02</p>
                  <h1><span className="chapter-title-emoji" aria-hidden="true">🕘</span>簽到</h1>
                  <p>每天記錄實際出勤時間、完成主管簽章，也要記得自己還有多少彈性補足時數。</p>
                </div>
              </div>

              <nav className="section-nav checkin-nav" aria-label="簽到章節目錄">
                <a href="#checkin-daily">📝 每日簽到</a>
                <a href="#checkin-hours">⏰ 上班時間</a>
                <a href="#checkin-schedule">📅 每週排班</a>
                <a href="#checkin-flex">⏳ 彈性時數</a>
                <a href="#checkin-forms">🔍 兩張表的差異</a>
                <a href="#checkin-salary-time">💰 薪資申報時間</a>
              </nav>

              <section id="checkin-daily" className="content-section checkin-detail-section">
                <div className="section-title checkin-section-title"><span aria-hidden="true">📝</span><div><p>每天都要完成</p><h2>每日簽到流程</h2></div></div>
                <div className="checkin-step-grid">
                  <article><strong>01</strong><div><h3>填寫實際時間</h3><p>依當天實際出勤情形，填寫日期、工讀開始時間、工讀結束時間及工讀時數。</p></div></article>
                  <article><strong>02</strong><div><h3>下班時送簽</h3><p>下班時將表格拿給致緯哥蓋章簽名，即完成今日簽到。</p></div></article>
                  <article><strong>03</strong><div><h3>致緯哥不在時</h3><p>若致緯哥請假或不在，請改由專案經理（芷蓉姐）蓋章簽名。</p></div></article>
                </div>
                <figure className="checkin-form-preview">
                  <button onClick={() => openLightbox("assets/checkin/attendance-log.jpg")} aria-label="放大查看兼任助理時數紀錄表範例">
                    <img src="assets/checkin/attendance-log.jpg" alt="國立政治大學研發處企畫組兼任助理時數紀錄表範例，包含日期、上下班時間、工讀時數、工讀生簽章及輔導人員簽章" />
                    <span>表格範例｜點圖放大</span>
                  </button>
                  <figcaption><strong>兼任助理時數紀錄表</strong><br />這張表記錄每天實際上下班時間，下班前別忘了完成主管簽章。</figcaption>
                </figure>
              </section>

              <section id="checkin-hours" className="content-section checkin-detail-section">
                <div className="section-title checkin-section-title"><span aria-hidden="true">⏰</span><div><p>固定時段</p><h2>上下班及休息時間</h2></div></div>
                <div className="checkin-table-wrap">
                  <table className="checkin-table">
                    <thead><tr><th scope="col">時段</th><th scope="col">時間</th><th scope="col">工讀時數</th></tr></thead>
                    <tbody>
                      <tr><th scope="row">上午班</th><td>09:00–12:00</td><td><strong>3 小時</strong></td></tr>
                      <tr className="break-row"><th scope="row">中午休息</th><td>12:00–13:30</td><td>1.5 小時（不計工時）</td></tr>
                      <tr><th scope="row">下午班</th><td>13:30–17:30</td><td><strong>4 小時</strong></td></tr>
                      <tr><th scope="row">整天班</th><td>09:00–12:00、13:30–17:30</td><td><strong>7 小時</strong></td></tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="checkin-schedule" className="content-section checkin-detail-section">
                <div className="section-title checkin-section-title"><span aria-hidden="true">📅</span><div><p>每週原則</p><h2>每週排班方式</h2></div></div>
                <div className="checkin-table-wrap compact">
                  <table className="checkin-table">
                    <thead><tr><th scope="col">排班方式</th><th scope="col">每週次數</th><th scope="col">時數說明</th></tr></thead>
                    <tbody>
                      <tr><th scope="row">半天班</th><td><strong>3 次</strong></td><td>上午班為 3 小時；下午班為 4 小時。</td></tr>
                      <tr><th scope="row">整天班</th><td><strong>1 次</strong></td><td>上午及下午合計 7 小時。</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="checkin-flex" className="content-section checkin-detail-section">
                <div className="section-title checkin-section-title"><span aria-hidden="true">⏳</span><div><p>請自己記好</p><h2>彈性補足時數</h2></div></div>
                <aside className="checkin-highlight">
                  <span aria-hidden="true">80</span>
                  <div><strong>這個職位每月工作時數為 80 小時</strong><p>上午班只有 3 小時，因此每安排一次上午班，會產生 1 小時的彈性補足時數。</p></div>
                </aside>
                <ul className="checkin-note-list">
                  <li><strong>請自己記錄</strong>目前累積多少彈性補足時數。</li>
                  <li>若單位臨時需要協助，而且你的時間可以配合，就盡量利用這些時數幫忙。</li>
                  <li>單位仍會優先配合你的時間，不會強制要求你取消原有行程。</li>
                  <li>如果當月的彈性補足時數已經全部補完，再繼續協助就會使當月工時超過 80 小時，請先告訴致緯哥，由致緯哥確認如何處理。</li>
                </ul>
              </section>

              <section id="checkin-forms" className="content-section checkin-detail-section">
                <div className="section-title checkin-section-title"><span aria-hidden="true">🔍</span><div><p>特別注意</p><h2>兩張表不要混淆</h2></div></div>
                <div className="checkin-table-wrap comparison">
                  <table className="checkin-table">
                    <thead><tr><th scope="col">比較項目</th><th scope="col">第二章｜兼任助理時數紀錄表</th><th scope="col">第四章｜薪資出勤紀錄單</th></tr></thead>
                    <tbody>
                      <tr><th scope="row">用途</th><td>每天上下班簽到</td><td>每月薪資申報</td></tr>
                      <tr><th scope="row">填寫時間</th><td><strong>當天實際上下班時間</strong></td><td>依照自己當月沒有課的時段填寫</td></tr>
                      <tr><th scope="row">完成方式</th><td>每天填寫，並請致緯哥或芷蓉姐蓋章簽名</td><td>確認當月合計為 <strong>80 小時</strong>後送出</td></tr>
                    </tbody>
                  </table>
                </div>
                <aside className="checkin-warning"><strong>請記住：</strong>第二章填的是「實際出勤時間」；第四章則依自己沒有課的時段完成當月 80 小時填報，因此兩張表上的時間可能不同。</aside>
              </section>

              <section id="checkin-salary-time" className="content-section checkin-detail-section">
                <div className="section-title checkin-section-title"><span aria-hidden="true">💰</span><div><p>提早完成申報</p><h2>為什麼兩張表的時間可能不同？</h2></div></div>
                <p className="checkin-intro">薪資處理約需要 15 個工作天。致緯哥希望助理能早一點領到薪水，因此薪資出勤紀錄單通常會在月中先完成申報。</p>
                <div className="checkin-table-wrap salary-timing">
                  <table className="checkin-table">
                    <thead><tr><th scope="col">完成申報時間</th><th scope="col">預計領薪時間</th><th scope="col">說明</th></tr></thead>
                    <tbody>
                      <tr className="recommended-row"><th scope="row">每月 15 日或其後 2～3 天</th><td><strong>通常為下個月初（約 5 日）</strong></td><td>可讓薪資較早進入處理流程。</td></tr>
                      <tr><th scope="row">等到月底再申報</th><td>可能延至下個月 16 日左右</td><td>因薪資處理約需 15 個工作天。</td></tr>
                    </tbody>
                  </table>
                </div>
                <aside className="checkin-latest-rule">若校方規定或作業方式有變動，請依最新通知辦理。</aside>
              </section>

              <footer className="page-footer"><span>國立政治大學研發處企畫組｜兼任助理交接手冊</span><span>02 — 簽到</span></footer>
            </section>
          )}

          {chapter === "salary" && (
            <section className="page-content handbook-page salary-page">
              <div className="chapter-heading">
                <div>
                  <p className="eyebrow">PART 04</p>
                  <h1>薪資</h1>
                  <p>每月依序備妥三份文件，再依下方說明完成列印。</p>
                </div>
                <div className="progress-card salary-progress" aria-label={`薪資文件進度 ${salaryProgress}%`}>
                  <span>{salaryCompletedCount} / {salaryChecklistIds.length}</span><strong>{salaryProgress}%</strong>
                  <div className="progress-track"><i style={{ width: `${salaryProgress}%` }} /></div>
                  <small>勾選紀錄會保留在這台裝置</small>
                </div>
              </div>

              <section className="content-section salary-overview" aria-labelledby="salary-overview-title">
                <div className="salary-overview-heading">
                  <p>本月應備文件</p>
                  <h2 id="salary-overview-title">本月薪資核銷文件</h2>
                </div>
                <div className="salary-date-notice"><span aria-hidden="true">📅</span><p><strong>薪資填報時間</strong>每月 15 日後，即可開始填報當月薪資。</p></div>
                <div className="salary-checklist" aria-label="本月薪資核銷文件清單">
                  {salaryDocuments.map((doc, index) => {
                    const checklistId = `salary-${doc.id}`;
                    return (
                      <article key={doc.id} className={`salary-check-card ${checked[checklistId] ? "is-checked" : ""}`}>
                        <button className="salary-card-preview" onClick={() => openLightbox(doc.previewPages)} aria-label={`放大查看${doc.name}列印範例，共 ${doc.previewPages.length} 張`}>
                          <img src={doc.preview} alt={`${doc.name}列印範例縮圖`} />
                          <span>列印範例・{doc.previewPages.length} 張</span>
                        </button>
                        <label>
                          <input type="checkbox" checked={Boolean(checked[checklistId])} onChange={() => toggle(checklistId)} />
                          <span className="custom-check" aria-hidden="true">{checked[checklistId] ? "✓" : ""}</span>
                          <span><small>{String(index + 1).padStart(2, "0")}</small><strong>{doc.name}</strong></span>
                        </label>
                        {doc.id === "attendance" && (
                          <p className="salary-card-reminder"><strong>出勤紀錄單：</strong>確認「時數總計」為 <b>80 小時</b>。</p>
                        )}
                        {doc.id === "appointment-proof" && (
                          <p className="salary-card-reminder"><strong>進用證明單：</strong>請 <mark>記下自己的「員工代號」、「計畫編號」及「進用單號」</mark>，後續薪資造冊時會使用。</p>
                        )}
                        {doc.id === "payroll" && (
                          <p className="salary-card-reminder"><strong>薪資清冊：</strong>在「承辦人」欄位簽上自己的名字。</p>
                        )}
                        <a href={`#salary-${doc.id}-steps`}>查看列印步驟 <span aria-hidden="true">↓</span></a>
                      </article>
                    );
                  })}
                </div>
                <aside className="salary-submit-notice">
                  <span aria-hidden="true">📁</span>
                  <p><strong>完成後繳交</strong>確認已列印出勤紀錄單、進用證明單及薪資清冊，並在薪資清冊的「承辦人」欄位簽名後，將三份文件夾入紅色公文夾，交給進用窗口(致緯哥)。</p>
                </aside>
              </section>

              <section id="salary-attendance-steps" className="content-section salary-detail-section">
                <div className="section-title"><span>1</span><div><p>列印步驟</p><h2>出勤紀錄單</h2></div></div>
                <div className="salary-steps">
                  <SalaryStep number={1} title="登入校務系統" image="assets/salary/attendance/steps/1.jpg" imageAlt="iNCCU 校園資訊系統中的校務系統 Web 入口" onOpen={() => openLightbox("assets/salary/attendance/steps/1.jpg")}>
                    <p>登入 iNCCU，從右下角的「校園資訊系統」點選「校務系統 Web 入口」，並選擇以「員工編號」登入。</p>
                    <a className="salary-inline-action" href="https://i.nccu.edu.tw/Login.aspx" target="_blank" rel="noreferrer">開啟 iNCCU <span aria-hidden="true">↗</span></a>
                  </SalaryStep>
                  <SalaryStep number={2} title="填寫當月出勤紀錄" image="assets/salary/attendance/steps/2.jpg" imageAlt="出勤紀錄填寫畫面，示範將同一天的八小時拆成兩筆四小時紀錄" onOpen={() => openLightbox("assets/salary/attendance/steps/2.jpg")} note={<>每筆出勤紀錄最多填寫 4 小時，不能直接將 8 小時填成一筆。例如同一天工作 8 小時，應分別填寫「08:00–12:00」及「13:00–17:00」。</>}>
                    <p>依序進入「行政資訊系統 → 助理人員相關作業 → 出勤紀錄填寫」，找到當月份的資料並點選「編輯」。逐筆填寫出勤日期、起始時間及結束時間，再按下「加入」。</p>
                  </SalaryStep>
                  <SalaryStep number={3} title="確認時數並送出表單" image="assets/salary/attendance/steps/3.jpg" imageAlt="出勤紀錄畫面下方顯示目前總計八十小時及送出表單按鈕" onOpen={() => openLightbox("assets/salary/attendance/steps/3.jpg")} note={<>送出前，務必確認畫面下方的「目前總計」為 80 小時。<span className="salary-critical-reminder">填寫完絕對要告訴致緯哥，致緯哥會負責轉告研發長。（不然研發長不會去確認 &gt;﹏&lt;）</span></>}>
                    <p>完成所有出勤紀錄後，確認畫面下方的「目前總計」已達 80 小時，再點選「送出表單」送交審核。</p>
                  </SalaryStep>
                  <SalaryStep number={4} title="等待研發長審核" image="assets/salary/attendance/steps/4.jpg" imageAlt="出勤紀錄列表的流程狀態顯示已送出" onOpen={() => openLightbox("assets/salary/attendance/steps/4.jpg")} note={<>流程狀態仍為「已送出」時，先不要列印出勤紀錄單。</>}>
                    <p>送出後，流程狀態會顯示為「已送出」。此時請等待研發長完成審核。</p>
                  </SalaryStep>
                  <SalaryStep number={5} title="列印出勤紀錄單" image="assets/salary/attendance/steps/5.jpg" imageAlt="出勤紀錄列表的流程狀態顯示已確認，並標示列印按鈕" onOpen={() => openLightbox("assets/salary/attendance/steps/5.jpg") }>
                    <p>待研發長完成審核，且流程狀態變為「已確認」後，點選右側的「列印」，印出當月出勤紀錄單，並接續辦理「進用證明單列印」與「薪資造冊」。</p>
                  </SalaryStep>
                </div>
                <aside className="salary-section-note"><strong>列印後確認</strong>請再次確認出勤紀錄單下方的「時數總計」為 80 小時。</aside>
              </section>

              <section id="salary-appointment-proof-steps" className="content-section salary-detail-section">
                <div className="section-title"><span>2</span><div><p>列印步驟</p><h2>進用證明單</h2></div></div>
                <div className="salary-steps">
                  <SalaryStep number={1} title="查詢進用單號" image="assets/salary/appointment/steps/1.jpg" imageAlt="政大進用系統首頁右側的查詢進用單號欄位" onOpen={() => openLightbox("assets/salary/appointment/steps/1.jpg")} note={<>出生年月日請依欄位提示，以西元年月日「yyyyMMdd」格式輸入。</>}>
                    <p>開啟政大進用系統，使用右下方的「查詢進用單號」功能，依序輸入身分證字號、出生年月日及圖形驗證碼，再點選「送出」。</p>
                    <a className="salary-inline-action" href="https://schwebap.nccu.edu.tw/pawb01/tempmenu.aspx" target="_blank" rel="noreferrer">開啟政大進用系統 <span aria-hidden="true">↗</span></a>
                  </SalaryStep>
                  <SalaryStep number={2} title="選擇研究發展處的進用資料" image="assets/salary/appointment/steps/2.jpg" imageAlt="進用單號查詢結果，以紅框標示研究發展處的進用單" onOpen={() => openLightbox("assets/salary/appointment/steps/2.jpg")} note={<>若畫面中有多筆進用紀錄，請選擇進用單位為「研究發展處」且聘期正確的資料。</>}>
                    <p>在查詢結果中找到進用單位為「研究發展處」的資料，確認聘用起迄日期無誤後，點選左側藍色的「進用單號」。</p>
                  </SalaryStep>
                  <SalaryStep number={3} title="列印進用證明單" image="assets/salary/appointment/steps/3.jpg" imageAlt="進用證明頁面，以紅框標示計畫資料及列印連結" onOpen={() => openLightbox("assets/salary/appointment/steps/3.jpg")} note={<>列印前，請再次確認選擇的是企畫組目前使用的計畫資料。</>}>
                    <p>進入「進用證明」頁面後，在「國科會及其他機構計畫資料」區塊確認計畫代號、單位及計畫主持人，再點選該筆資料左側的「列印」。</p>
                  </SalaryStep>
                </div>
                <aside className="salary-section-note"><strong>請先記下</strong>列印後，請 <mark>記下自己的「員工代號」、「計畫編號」及「進用單號」</mark>，後續辦理薪資造冊時會使用。</aside>
              </section>

              <section id="salary-payroll-steps" className="content-section salary-detail-section">
                <div className="section-title"><span>3</span><div><p>造冊與列印步驟</p><h2>薪資清冊</h2></div></div>
                <div className="salary-steps">
                  <SalaryStep number={1} title="使用 IE 開啟新平台校務系統" image="assets/salary/payroll/steps/1.jpg" imageAlt="iNCCU 校園資訊系統中的新平台校務系統圖示，旁邊提醒只能使用 IE 瀏覽器" onOpen={() => openLightbox("assets/salary/payroll/steps/1.jpg")} note={<>「新平台校務系統」只能使用 Internet Explorer（IE）瀏覽器開啟。請複製網址後，再貼到 IE 瀏覽器。</>}>
                    <p>登入 iNCCU 後，從右下角的「校園資訊系統」點選「新平台校務系統」。</p>
                    <button className="salary-inline-action copy-action" onClick={copyInccuUrl}>{copiedInccu ? "已複製 iNCCU 網址 ✓" : "複製 iNCCU 網址"}</button>
                  </SalaryStep>
                  <SalaryStep number={2} title="進入薪資造冊功能" image="assets/salary/payroll/steps/2.jpg" imageAlt="新平台校務系統左側功能樹，以紅框標示人員薪資或學習津貼造冊" onOpen={() => openLightbox("assets/salary/payroll/steps/2.jpg")}>
                    <p>進入新平台校務系統後，將左上方的系統選擇為「教職員資訊系統」，再依序展開「單位薪資或學習津貼造冊作業 → 人員薪資或學習津貼造冊」。</p>
                  </SalaryStep>
                  <SalaryStep number={3} title="建立薪資資料" image="assets/salary/payroll/steps/3.jpg" imageAlt="薪資造冊主畫面，依序標示人員類別、員工編號、進用單號、建立薪資及轉清冊" onOpen={() => openLightbox("assets/salary/payroll/steps/3.jpg")} note={<>此步驟會使用進用證明單上的「員工代號」與「進用單號」。</>}>
                    <ol className="salary-substeps">
                      <li>「人員類別」選擇「計畫類人員」。</li>
                      <li>填寫自己的員工編號。</li>
                      <li>選擇正確的進用單號，其他個人及計畫資料會由系統自動帶入。</li>
                      <li>確認資料無誤後，點選「建立薪資」。</li>
                      <li>再點選「轉清冊」。</li>
                    </ol>
                  </SalaryStep>
                  <SalaryStep number={4} title="查詢並執行造冊" image="assets/salary/payroll/steps/4.jpg" imageAlt="單位薪資建檔造冊畫面，依序標示薪資月份、人員類別、查詢、勾選資料及執行造冊" onOpen={() => openLightbox("assets/salary/payroll/steps/4.jpg")}>
                    <ol className="salary-substeps">
                      <li>填寫要申報薪資的年份與月份。</li>
                      <li>「人員類別」選擇「計畫類人員」。</li>
                      <li>點選「查詢」。</li>
                      <li>勾選步驟 3 建立的當月薪資資料。</li>
                      <li>點選「執行造冊」。</li>
                    </ol>
                  </SalaryStep>
                  <SalaryStep number={5} title="修改案由並選擇計畫" image="assets/salary/payroll/steps/5.jpg" imageAlt="薪資造冊資料填寫視窗，以紅框標示案由及選擇計畫按鈕" onOpen={() => openLightbox("assets/salary/payroll/steps/5.jpg")}>
                    <p>將系統自動帶入的「案由」修改為「姓名＋薪資月份＋薪資或學習津貼」，例如「王小美08月薪資或學習津貼」，完成後點選「選擇計畫」。</p>
                  </SalaryStep>
                  <SalaryStep number={6} title="查詢並選擇計畫" image="assets/salary/payroll/steps/6.jpg" imageAlt="選擇計畫編號視窗，以紅框標示計畫編號、查詢按鈕及計畫結果" onOpen={() => openLightbox("assets/salary/payroll/steps/6.jpg")} note={<>請確認計畫編號及計畫名稱皆正確。</>}>
                    <p>輸入進用證明單上的「計畫編號」，再點選「查詢」。查詢結果出現後，連按兩下正確的計畫。</p>
                  </SalaryStep>
                  <SalaryStep number={7} title="確認造冊" image="assets/salary/payroll/steps/7.jpg" imageAlt="薪資造冊資料填寫視窗，以紅框標示已選取的計畫及確定造冊按鈕" onOpen={() => openLightbox("assets/salary/payroll/steps/7.jpg")}>
                    <p>確認畫面中的案由及計畫資料無誤，並已選取正確的計畫後，點選「確定造冊」。</p>
                  </SalaryStep>
                  <SalaryStep number={8} title="列印清冊" image="assets/salary/payroll/steps/8.jpg" imageAlt="薪資造冊主畫面，以紅框標示列印清冊按鈕" onOpen={() => openLightbox("assets/salary/payroll/steps/8.jpg")}>
                    <p>完成造冊並回到主畫面後，點選上方的「列印清冊」。</p>
                  </SalaryStep>
                  <SalaryStep number={9} title="選擇清冊並產生報表" image="assets/salary/payroll/steps/9.jpg" imageAlt="查詢薪資視窗，以紅框標示清冊號下拉選單，並提示選擇最新造冊的薪資清冊" onOpen={() => openLightbox("assets/salary/payroll/steps/9.jpg")}>
                    <p>從「清冊號」下拉選單中，選擇自己最新建立的薪資清冊，再點選「產生報表」，即可產生並列印薪資清冊。</p>
                  </SalaryStep>
                </div>
                <aside className="salary-section-note rose"><strong>列印後簽名</strong>列印薪資清冊後，請在下方的「承辦人」欄位親筆簽名，再交給致緯哥蓋章。</aside>
                <a className="salary-final-check-link" href="#salary-overview-title"><span aria-hidden="true">↑</span><span><small>所有文件都備齊了</small>返回「本月薪資核銷文件」做最後確認</span></a>
              </section>

              <footer className="page-footer"><span>國立政治大學研發處企畫組｜兼任助理交接手冊</span><span>04 — 薪資</span></footer>
            </section>
          )}

          {chapter === "work" && (
            <section className="page-content handbook-page work-page">
              <div className="chapter-heading">
                <div>
                  <p className="eyebrow">PART 03</p>
                  <h1>工作百寶袋</h1>
                  <p>把企畫組常用的系統、工具、活動流程與工作提醒收在一起，需要時就從這裡開始找。</p>
                </div>
              </div>

              <nav id="work-menu" className="work-shortcut-nav" aria-label="工作百寶袋快捷目錄">
                {workSections.map((section) => (
                  <a key={section.id} href={`#${section.id}`}><span aria-hidden="true">{section.emoji}</span>{section.title}</a>
                ))}
              </nav>

              <div className="work-detail-list">
                {workSections.map((section, index) => (
                  <section key={section.id} id={section.id} className="content-section work-detail-section">
                    <div className="section-title"><span className="work-section-icon" aria-hidden="true">{section.emoji}</span><div><p>百寶袋 {String(index + 1).padStart(2, "0")}</p><h2>{section.title}</h2></div></div>
                    {section.id === "work-tools" ? (
                      <div className="work-tools-content">
                        <section className="phone-guide" aria-labelledby="phone-guide-title">
                          <div className="work-subheading">
                            <span aria-hidden="true">☎️</span>
                            <div><small>辦公室基本操作</small><h3 id="phone-guide-title">電話使用方式</h3></div>
                          </div>
                          <div className="phone-operation-grid">
                            <article><span>01</span><div><h4>轉接電話</h4><p>按下電話機上的 <kbd className="phone-key phone-key-wide">轉接</kbd> 按鍵，再輸入對方的分機號碼，最後掛回話筒，即完成轉接。</p></div></article>
                            <article><span>02</span><div><h4>代接電話</h4><p>依序按下 <span className="phone-key-sequence"><kbd className="phone-key">1</kbd><span aria-hidden="true">→</span><kbd className="phone-key">3</kbd></span>，即可代接其他分機的來電。</p></div></article>
                            <article><span>03</span><div><h4>撥打外線</h4><p>先按 <kbd className="phone-key">0</kbd>，再輸入手機號碼或市內電話號碼。撥打臺北市話時，<strong className="phone-no-code">不需輸入 02</strong>。</p></div></article>
                          </div>

                          <div className="phone-memo-block">
                            <div className="phone-memo-copy">
                              <small>代接電話後別漏寫</small>
                              <h4>桌面留言格式參考</h4>
                              <button onClick={() => setPhoneMemoOpen(true)}>放大並列印一張便利貼 <span aria-hidden="true">↗</span></button>
                            </div>
                            <div className="phone-memo-visual">
                              <aside className="phone-greeting"><span aria-hidden="true">👋</span><p><small>接起電話時先說</small><strong>「研發處您好。」</strong></p></aside>
                              <button className="phone-memo-preview" onClick={() => setPhoneMemoOpen(true)} aria-label="放大查看電話代接留言格式並列印">
                                <PhoneMemo compact />
                                <span className="memo-click-label">點擊放大・可單張列印</span>
                              </button>
                              <aside className="phone-greeting phone-after-call"><span aria-hidden="true">📝</span><p><small>代接電話後</small><strong>請將來電資訊手寫在實體便利貼上，再貼至對方桌面。</strong></p></aside>
                            </div>
                          </div>
                        </section>

                        <section className="office-guide" aria-labelledby="office-guide-title">
                          <div className="work-subheading">
                            <span aria-hidden="true">🗺️</span>
                            <div><small>接電話時快速找人</small><h3 id="office-guide-title">辦公室座位、分機與業務速查</h3></div>
                          </div>
                          <p className="office-guide-intro">每張座位卡均標示職稱、分機及重點業務；點擊可查看完整業務內容。</p>
                          <div className="office-legend" aria-label="座位圖顏色說明">
                            <span className="planning">企畫組</span>
                            <span className="topu">高教深耕計畫辦公室</span>
                            <span className="shared">空間與動線</span>
                            <span className="swipe-hint">手機點擊縮圖放大</span>
                          </div>

                          <button className="office-map-mobile-preview" onClick={() => setOfficeMapCardOpen(true)} aria-label="放大查看辦公室座位與分機小抄">
                            <OfficeDeskCard />
                            <span>點擊放大・可單張列印</span>
                          </button>

                          <div className="office-map-scroll office-map-desktop">
                            <div className="office-map" aria-label="企畫組與高教深耕計畫辦公室座位圖">
                              <div className="office-top-row">
                                <div className="office-door"><span aria-hidden="true">🚪</span><strong>門口</strong></div>
                                <OfficeSeat person={officePeople.find((person) => person.id === "wang")!} positionClass="seat-wang" onSelect={setOfficePersonId} />
                                <div className="meeting-nook" aria-label="圓桌與兩張椅子，位置緊鄰葉致緯座位">
                                  <span className="chair top" aria-hidden="true" />
                                  <span className="round-table">圓桌</span>
                                  <span className="chair bottom" aria-hidden="true" />
                                  <small>兩張椅子</small>
                                </div>
                                <OfficeSeat person={officePeople.find((person) => person.id === "yeh")!} positionClass="seat-yeh" onSelect={setOfficePersonId} />
                                <OfficeSeat person={officePeople.find((person) => person.id === "kuo")!} positionClass="seat-kuo" onSelect={setOfficePersonId} />
                              </div>

                              <div className="office-lower-area">
                                <div className="office-horizontal-corridor" aria-label="橫向走廊"><strong>走廊</strong></div>
                                <div className="office-left-stack">
                                  <OfficeSeat person={officePeople.find((person) => person.id === "assistant")!} positionClass="seat-assistant" onSelect={setOfficePersonId} />
                                  <OfficeSeat person={officePeople.find((person) => person.id === "hsieh")!} positionClass="seat-hsieh" onSelect={setOfficePersonId} />
                                </div>
                                <div className="office-corridor"><span>走廊</span><div className="paper-cutter"><span aria-hidden="true">✂️</span>裁紙機、電動訂書機</div></div>
                                <div className="office-right-stack">
                                  <OfficeSeat person={officePeople.find((person) => person.id === "tai")!} positionClass="seat-tai" onSelect={setOfficePersonId} />
                                  <OfficeSeat person={officePeople.find((person) => person.id === "hung")!} positionClass="seat-hung" onSelect={setOfficePersonId} />
                                </div>
                              </div>
                            </div>
                          </div>
                          <button className="office-map-print-button" onClick={() => setOfficeMapCardOpen(true)}>🖨️ 查看並列印座位與分機小抄</button>
                          <p className="office-source-note">分機與業務依政大研發處及高教深耕計畫辦公室官方人員資料整理。</p>
                        </section>
                      </div>
                    ) : section.id === "work-registration" ? (
                      <div className="work-tools-content">
                        <div className="system-guide">
                          <div className="system-guide-copy">
                            <p className="system-guide-kicker">校務系統操作</p>
                            <h3>用「活動報到(網路版)」幫學員報到</h3>
                            <ol>
                              <li>
                                <b>開啟活動報到(網路版)</b>
                                <span>登入新平台校務系統後，於左側選單「活動與繳費作業」下點選「活動報到(網路版)」。</span>
                                <button className="system-step-image" onClick={() => openLightbox("assets/registration/step-1.jpg")} aria-label="放大查看活動報到網路版位置">
                                  <img src="assets/registration/step-1.jpg" alt="校務系統左側選單，以紅框標示「活動報到(網路版)」" />
                                  <span>操作畫面 1｜點圖放大</span>
                                </button>
                              </li>
                              <li>
                                <b>搜尋活動並勾選報到選項</b>
                                <span>用活動代碼或活動日期搜尋到當天的活動並點選該筆資料，勾選「接受登記/候補或未報名者報到」與「對於登記/候補或未報名者跳出詢問視窗」兩個選項，再點選「進入報到模式」。</span>
                                <button className="system-step-image" onClick={() => openLightbox("assets/registration/step-2.jpg")} aria-label="放大查看勾選報到選項畫面">
                                  <img src="assets/registration/step-2.jpg" alt="活動報到(網路版)搜尋結果，以紅框標示活動列與兩個報到選項" />
                                  <span>操作畫面 2｜點圖放大</span>
                                </button>
                              </li>
                              <li>
                                <b>讓學員嗶卡或手動輸入編號</b>
                                <span>進入報到模式後，請學員使用手機報到條碼（需使用條碼掃描器）或學生／職員證（需使用 MIFARE 讀卡機）嗶卡，也可以手動輸入學號或員工編號完成報到。</span>
                                <button className="system-step-image" onClick={() => openLightbox("assets/registration/step-3.jpg")} aria-label="放大查看報到模式畫面">
                                  <img src="assets/registration/step-3.jpg" alt="活動報到(網路版)報到模式，以紅框標示掃描或手動輸入欄位" />
                                  <span>操作畫面 3｜點圖放大</span>
                                </button>
                              </li>
                            </ol>
                            <aside className="registration-note">
                              <strong>補充說明｜未正式報名者</strong>
                              <p>若嗶卡或輸入的人員不是這場活動的正式報名者，系統會跳出提醒視窗，詢問是否要補報名並完成報到。</p>
                              <button className="system-step-image" onClick={() => openLightbox("assets/registration/step-4.jpg")} aria-label="放大查看未正式報名者提醒視窗">
                                <img src="assets/registration/step-4.jpg" alt="未正式報名者跳出的提醒視窗，詢問是否要報名並完成報到" />
                                <span>補充說明｜點圖放大</span>
                              </button>
                            </aside>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="work-content-placeholder"><p>本節內容待整理。</p></div>
                    )}
                    <a className="work-back-link" href="#work-menu">↑ 返回工作百寶袋目錄</a>
                  </section>
                ))}
              </div>

              <footer className="page-footer"><span>國立政治大學研發處企畫組｜兼任助理交接手冊</span><span>03 — 工作百寶袋</span></footer>
            </section>
          )}

        </article>
      </div>

      {phoneMemoOpen && (
        <div className="phone-note-modal" role="dialog" aria-modal="true" aria-label="電話代接留言格式列印預覽" onClick={() => setPhoneMemoOpen(false)}>
          <button className="dialog-close" onClick={() => setPhoneMemoOpen(false)} aria-label="關閉電話留言格式">×</button>
          <div className="phone-note-modal-stage" onClick={(event) => event.stopPropagation()}>
            <PhoneMemo printable />
            <div className="phone-note-actions">
              <p>列印尺寸：8 × 8 公分。</p>
              <button onClick={() => printDeskCard("printing-phone-note")}>🖨️ 列印一張便利貼</button>
            </div>
          </div>
        </div>
      )}

      {officeMapCardOpen && (
        <div className="office-map-card-modal" role="dialog" aria-modal="true" aria-label="辦公室座位與分機小抄列印預覽" onClick={() => setOfficeMapCardOpen(false)}>
          <button className="dialog-close" onClick={() => setOfficeMapCardOpen(false)} aria-label="關閉座位與分機小抄">×</button>
          <div className="office-map-card-stage" onClick={(event) => event.stopPropagation()}>
            <OfficeDeskCard />
            <div className="phone-note-actions">
              <p>列印尺寸：13 × 9.2 公分（橫式）。</p>
              <button onClick={() => printDeskCard("printing-office-map-card")}>🖨️ 列印座位分機小抄</button>
            </div>
          </div>
        </div>
      )}

      {selectedOfficePerson && (
        <div className="office-person-modal" role="dialog" aria-modal="true" aria-label={`${selectedOfficePerson.name}業務資訊`} onClick={() => setOfficePersonId(null)}>
          <button className="dialog-close" onClick={() => setOfficePersonId(null)} aria-label="關閉人員業務資訊">×</button>
          <article className={`office-person-card ${selectedOfficePerson.team} ${selectedOfficePerson.isAssistant ? "is-you" : ""}`} onClick={(event) => event.stopPropagation()}>
            <small>{selectedOfficePerson.team === "planning" ? "企畫組" : "高教深耕計畫辦公室"}</small>
            <h3>{selectedOfficePerson.name}</h3>
            <p className="office-person-meta">{selectedOfficePerson.title}・☎️ 分機 {selectedOfficePerson.extension}</p>
            <strong>主要業務</strong>
            <ul>{selectedOfficePerson.duties.map((duty) => <li key={duty}>{duty}</li>)}</ul>
          </article>
        </div>
      )}

      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="圖片預覽" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="關閉圖片預覽">×</button>
          <div className="lightbox-stage" onClick={(event) => event.stopPropagation()}>
            <img src={lightbox[lightboxIndex]} alt={`放大預覽${lightbox.length > 1 ? `，第 ${lightboxIndex + 1} 張，共 ${lightbox.length} 張` : ""}`} />
            {lightbox.length > 1 && (
              <div className="lightbox-controls" aria-label="範例圖片切換">
                <button onClick={() => setLightboxIndex((index) => (index - 1 + lightbox.length) % lightbox.length)} aria-label="上一張">← 上一張</button>
                <span>{lightboxIndex + 1} / {lightbox.length}</span>
                <button onClick={() => setLightboxIndex((index) => (index + 1) % lightbox.length)} aria-label="下一張">下一張 →</button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

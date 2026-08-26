"use client";

import { useEffect, useMemo, useState } from "react";

type Chapter = "cover" | "hiring" | "work" | "salary" | "other";
type Identity = "single" | "internal" | "external" | "both";
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

const chapters: Array<{ id: Chapter; number: string; label: string; color: string }> = [
  { id: "cover", number: "", label: "封面", color: "#ded7c8" },
  { id: "hiring", number: "01", label: "進用", color: "#e7bd56" },
  { id: "work", number: "02", label: "工作內容", color: "#9db9ad" },
  { id: "salary", number: "03", label: "薪資", color: "#8da7bf" },
  { id: "other", number: "04", label: "其他", color: "#b5a4bb" },
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

export default function Home() {
  const [chapter, setChapter] = useState<Chapter>("cover");
  const [identity, setIdentity] = useState<Identity>("single");
  const [insuredElsewhere, setInsuredElsewhere] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [lightbox, setLightbox] = useState<string[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [copiedInccu, setCopiedInccu] = useState(false);

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
              <div className="cover-status"><span className="status-dot" />第一版框架｜01 進用完成・03 薪資整理中</div>
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

          {chapter === "salary" && (
            <section className="page-content handbook-page salary-page">
              <div className="chapter-heading">
                <div>
                  <p className="eyebrow">PART 03</p>
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
                  <SalaryStep number={3} title="確認時數並送出表單" image="assets/salary/attendance/steps/3.jpg" imageAlt="出勤紀錄畫面下方顯示目前總計八十小時及送出表單按鈕" onOpen={() => openLightbox("assets/salary/attendance/steps/3.jpg")} note={<>送出前，務必確認畫面下方的「目前總計」為 80 小時。</>}>
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
                <aside className="salary-section-note"><strong>請先記下</strong>列印後，請記下自己的「員工代號」、「計畫編號」及「進用單號」，後續辦理薪資造冊時會使用。</aside>
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
                  <SalaryStep number={9} title="選擇清冊並產生報表" image="assets/salary/payroll/steps/9.jpg" imageAlt="查詢薪資視窗，顯示清冊號下拉選單及產生報表按鈕" onOpen={() => openLightbox("assets/salary/payroll/steps/9.jpg")}>
                    <p>從「清冊號」下拉選單中，選擇自己最新建立的薪資清冊，再點選「產生報表」，即可產生並列印薪資清冊。</p>
                  </SalaryStep>
                </div>
                <aside className="salary-section-note rose"><strong>列印後簽名</strong>列印薪資清冊後，請在下方的「承辦人」欄位親筆簽名。</aside>
              </section>

              <footer className="page-footer"><span>國立政治大學研發處企畫組｜兼任助理交接手冊</span><span>03 — 薪資</span></footer>
            </section>
          )}

          {(chapter === "work" || chapter === "other") && (
            <section className="page-content placeholder-page">
              <p className="eyebrow">PART {chapters.find((item) => item.id === chapter)?.number}</p>
              <h1>{chapters.find((item) => item.id === chapter)?.label}</h1>
              <div className="placeholder-rule" /><p>本章內容將在資料整理完成後補上。</p><span className="placeholder-stamp">內容待整理</span>
              <p className="page-number">{chapters.findIndex((item) => item.id === chapter) + 1}</p>
            </section>
          )}
        </article>

        <nav className="bookmark-tabs" aria-label="手冊章節">
          {chapters.map((item) => (
            <button key={item.id} className={chapter === item.id ? "active" : ""} style={{ "--tab-color": item.color } as React.CSSProperties} onClick={() => changeChapter(item.id)} aria-current={chapter === item.id ? "page" : undefined}>
              {item.number && <span>{item.number}</span>}{item.label}
            </button>
          ))}
        </nav>
      </div>

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

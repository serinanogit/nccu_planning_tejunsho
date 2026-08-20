"use client";

import { useEffect, useMemo, useState } from "react";

type Chapter = "cover" | "hiring" | "work" | "salary" | "other";
type Identity = "single" | "concurrent";
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
  { id: "contract", name: "計畫兼任助理定期勞動契約書", copies: "印 3 份", system: true, preview: "assets/doc-previews/contract/page-1.jpg", previewPages: ["assets/doc-previews/contract/page-1.jpg", "assets/doc-previews/contract/page-2.jpg"], note: null, href: null, linkLabel: null },
  { id: "description", name: "計畫兼任助理工作說明書", copies: "印 1 份", system: false, preview: "assets/doc-previews/description/page-1.jpg", previewPages: ["assets/doc-previews/description/page-1.jpg", "assets/doc-previews/description/page-2.jpg"], note: null, href: null, linkLabel: null, downloadHref: "assets/forms/job-description-form.doc", downloadName: "計畫兼任助理工作說明書.doc" },
  { id: "relationship", name: "計畫兼任助理勞動型關係認定表", copies: "印 4 份", system: false, preview: "assets/doc-previews/relationship/example.jpg", previewPages: ["assets/doc-previews/relationship/example.jpg"], note: null, href: null, linkLabel: null, downloadHref: "assets/forms/labor-relationship-form.docx", downloadName: "計畫兼任助理勞動型關係認定表.docx" },
  { id: "pension", name: "提繳勞工退休金比例同意書", copies: "印 1 份", system: true, preview: null, note: null, href: null, linkLabel: null },
  { id: "health", name: "健保投保確認申請表", copies: "印 1 份", system: true, preview: null, note: null, href: null, linkLabel: null },
  { id: "enrollment", name: "在學證明", copies: "印 1 份", system: false, preview: null, note: null, href: "https://moltke.nccu.edu.tw/sturegcert_SSO/index.jsp", linkLabel: "申請在學證明" },
  { id: "funding", name: "經費核定清單", copies: "向進用窗口(致緯哥)索取", system: false, preview: null, note: null, href: null, linkLabel: null },
];

const safetySteps = [
  "完成「一般職業安全衛生教育訓練課程（上）」。",
  "完成「一般職業安全衛生教育訓練課程（下）」。",
  "至「個人專區 → 學習履歷 → 列印學習紀錄」下載學習時數證明。",
  "列印並填寫教育訓練證明單的基本資料，將學習時數證明附在證明單後面，再交給進用窗口(致緯哥)確認實體課程欄位及主管簽章。",
  "將完整文件送至總務處環安組備查。",
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

export default function Home() {
  const [chapter, setChapter] = useState<Chapter>("cover");
  const [identity, setIdentity] = useState<Identity>("single");
  const [insuredElsewhere, setInsuredElsewhere] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [lightbox, setLightbox] = useState<string[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("nccu-handbook-progress");
    const savedIdentity = window.localStorage.getItem("nccu-handbook-identity") as Identity | null;
    const savedInsurance = window.localStorage.getItem("nccu-handbook-insured-elsewhere");
    if (saved) setChecked(JSON.parse(saved));
    if (savedIdentity === "single" || savedIdentity === "concurrent") setIdentity(savedIdentity);
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
    () => identity === "concurrent"
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

  return (
    <main className="site-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">政</span>
          <div>
            <p>國立政治大學｜研發處企畫組</p>
            <strong>兼任助理交接手冊</strong>
          </div>
        </div>
        <p className="role-note">本手冊已依「企畫組兼任助理」職位設定</p>
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
              <p className="cover-subtitle">從進用、工作內容到薪資核銷，<br />把每一步留給下一位助理。</p>
              <button className="primary-button" onClick={() => changeChapter("hiring")}>
                開始閱讀 01 進用 <span aria-hidden="true">→</span>
              </button>
              <div className="cover-status"><span className="status-dot" />第一版框架｜目前完成「01 進用」</div>
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
                    <label className={identity === "concurrent" ? "selected" : ""}>
                      <input type="radio" name="identity" checked={identity === "concurrent"} onChange={() => setIdentity("concurrent")} />
                      <span><strong>同時兼任其他兼任助理或工讀</strong><small>研究獎助生不算在內</small></span>
                    </label>
                  </fieldset>
                  {identity === "concurrent" && (
                    <div className="follow-up"><label><input type="checkbox" checked={insuredElsewhere} onChange={(event) => setInsuredElsewhere(event.target.checked)} />其他工讀單位或公司已為我投保健保</label></div>
                  )}
                  <div className="insurance-summary" aria-live="polite">
                    <div><span className="insurance-icon">勞</span><p><strong>勞保：強制投保</strong></p></div>
                    <div><span className="insurance-icon health">健</span><p><strong>健保：{identity === "concurrent" && insuredElsewhere ? "可向人事室承辦人確認免在本職位投保" : "需辦理投保"}</strong><br />只有同時兼任其他工讀，且該單位已協助投保健保，才可不在本職位提撥。</p></div>
                  </div>
                </div>
              </section>

              <section id="documents" className="content-section">
                <div className="section-title"><span>2</span><div><p>準備並核對</p><h2>進用文件清單</h2></div></div>
                <div id="appointment-system" className="system-guide">
                  <div className="system-guide-copy">
                    <p className="system-guide-kicker">進用系統操作</p>
                    <h3>先在系統建立本次進用資料</h3>
                    <ol>
                      <li><b>開啟進用系統</b><span>點選左側「高教深耕／雙語計畫」，不要從其他類別進入。</span></li>
                      <li className="system-plan-step">
                        <b>選擇計畫</b>
                        <span>請先跟進用窗口(致緯哥)確認以下資訊，再輸入中文姓名、英文姓名與身分證字號。</span>
                        <dl className="system-plan-values">
                          <div><dt>學院／系所</dt><dd>R00 研究發展處</dd></div>
                          <div><dt>計畫主持人</dt><dd>研發長 <small>114-2 學期：107954／徐士勛</small></dd></div>
                          <div><dt>計畫編號</dt><dd>115H111-01／115H111-01 學術研究國際接軌計畫</dd></div>
                        </dl>
                        <em className="annual-code-note">每年計畫代碼會變：基本格式為「民國年＋H111-01」，例如 116 年為 116H111-01。請以進用窗口(致緯哥)提供的當年度選項為準。</em>
                      </li>
                      <li><b>填寫資料</b><span>填寫聘期、計畫名稱、執行單位、工作內容、薪資及勞健保／退休金資料；計畫或聘期若有疑問先問進用窗口(致緯哥)。</span></li>
                      <li><b>列印文件</b><span>由系統產出進用單、定期勞動契約書、退休金比例同意書及健保投保確認申請表，再依清單份數列印。</span></li>
                    </ol>
                    <a className="system-link" href="https://schwebap.nccu.edu.tw/pawb01/tempmenu.aspx" target="_blank" rel="noreferrer">開啟政大進用系統 <span aria-hidden="true">↗</span></a>
                  </div>
                  <button className="system-guide-image" onClick={() => openLightbox("assets/doc-previews/system-guide.jpg")} aria-label="放大查看進用系統操作範例">
                    <img src="assets/doc-previews/system-guide.jpg" alt="政大新進人員進用登錄系統操作範例，以紅框標示高教深耕／雙語計畫入口及計畫選擇欄位" />
                    <span>操作畫面｜點圖放大</span>
                  </button>
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
                {identity === "concurrent" && <p className="conditional-note">已依你的身分自動加入「保險費經費分攤同意書」。</p>}
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
                    <div key={step}>
                      <CheckItem id={`safety-${index}`} checked={Boolean(checked[`safety-${index}`])} onChange={toggle}>
                        <span className="step-text"><b>步驟 {index + 1}</b>{step}</span>
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
                          <button onClick={() => openLightbox("assets/一般安全衛生教育訓練證明單_填寫範例.jpg")} aria-label="放大查看教育訓練證明單填寫範例">
                            <img src="assets/一般安全衛生教育訓練證明單_填寫範例.jpg" alt="一般安全衛生教育訓練證明單填寫範例，標示實施日期欄位" />
                            <span>點圖放大</span>
                          </button>
                          <figcaption><strong>填寫範例｜實施日期也要填寫</strong><br />原則上填報到日，請先問進用窗口(致緯哥)。</figcaption>
                        </figure>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <footer className="page-footer"><span>國立政治大學研發處企畫組｜兼任助理交接手冊</span><span>01 — 進用</span></footer>
            </section>
          )}

          {(chapter === "work" || chapter === "salary" || chapter === "other") && (
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

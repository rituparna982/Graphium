import { FileText, Code, Database, Sparkles, Download, MessageSquare } from "lucide-react";
import styles from "./paper.module.css";

export default function PaperDetail() {
  return (
    <div className={styles.paperContainer}>
      <header className={styles.paperHeader}>
        <div className={styles.headerTop}>
          <span className={styles.journalBadge}>Nature Physics</span>
          <span className={styles.date}>Published Oct 2025</span>
        </div>
        <h1 className={styles.title}>Neural Networks for Quantum Chemistry: Accelerating Variational Solvers on NISQ Devices</h1>
        <div className={styles.authors}>
          <span className={styles.author}>Dr. Sarah Chen</span>
          <span className={styles.author}>James Wilson</span>
          <span className={styles.author}>Elena Rodriguez</span>
        </div>
        <div className={styles.actionRow}>
           <button className={styles.primaryBtn}><Download size={18}/> Download PDF</button>
           <button className={styles.secondaryBtn}><MessageSquare size={18}/> Discuss</button>
           <div className={styles.metrics}>
              <span><strong>248</strong> Citations</span>
              <span><strong>12k</strong> Reads</span>
           </div>
        </div>
      </header>

      <div className={styles.splitView}>
        <div className={styles.mainContent}>
          <section className={`glass ${styles.section}`}>
            <h2 className={styles.sectionTitle}>Abstract</h2>
            <p className={styles.text}>
              Simulating molecular dynamics on Noisy Intermediate-Scale Quantum (NISQ) hardware remains a significant challenge due to vanishing gradients and limited coherence times. We introduce a hybrid quantum-classical architecture where a classical neural network pre-optimizes the parameter space for the Variational Quantum Eigensolver (VQE), reducing overall circuit depth and required coherence time by up to 40%.
            </p>
          </section>
          
          <section className={`glass ${styles.section}`}>
            <h2 className={styles.sectionTitle}>Introduction</h2>
            <p className={styles.text}>
              The intersection of quantum computing and machine learning provides novel avenues for solving classically intractable problems. In this paper, we explore how mapping parameterized quantum circuits to multi-layered perceptrons can identify promising sub-spaces in the objective landscape prior to deployment on actual quantum hardware. This significantly minimizes the burden on realistic devices...
            </p>
            <div className={styles.fadeText}></div>
          </section>
        </div>

        <div className={styles.sideContent}>
          <section className={`glass ${styles.aiSection}`}>
             <div className={styles.aiHeader}>
                <Sparkles size={20} className={styles.aiIcon} />
                <h2>AI Insights</h2>
             </div>
             <div className={styles.aiContent}>
                <p><strong>Key Takeaways:</strong></p>
                <ul>
                  <li>Proposes a hybrid quantum-classical model.</li>
                  <li>Reduces VQE training time by 40%.</li>
                  <li>Demonstrated on 16-qubit superconducting hardware.</li>
                </ul>
                <button className={styles.aiAction}>Generate Full Summary</button>
             </div>
          </section>

          <section className={`glass ${styles.resourceSection}`}>
             <h2 className={styles.sectionTitle}>Linked Resources</h2>
             
             <div className={styles.resourceItem}>
                <Code size={20} className={styles.resourceIcon} />
                <div className={styles.resourceDetails}>
                   <h3>GitHub Repository</h3>
                   <p>quantum-nn-vqe-solver</p>
                </div>
                <button className={styles.linkBtn}>View</button>
             </div>

             <div className={styles.resourceItem}>
                <Database size={20} className={styles.resourceIcon} />
                <div className={styles.resourceDetails}>
                   <h3>Training Datasets</h3>
                   <p>Molecular configurations (H2O, LiH)</p>
                </div>
                <button className={styles.linkBtn}>View</button>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}

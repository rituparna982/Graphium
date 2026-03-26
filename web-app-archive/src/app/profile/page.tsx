import { MapPin, Link as LinkIcon, Building2, BookOpen, CheckCircle } from "lucide-react";
import styles from "./profile.module.css";

export default function Profile() {
  return (
    <div className={styles.profileContainer}>
      <header className={styles.profileHeader}>
        <div className={styles.banner}></div>
        <div className={styles.headerContent}>
          <div className={styles.avatar}>DR</div>
          <div className={styles.headerInfo}>
            <h1 className={styles.name}>Dr. Sarah Chen <CheckCircle size={20} className={styles.verifiedIcon} /></h1>
            <p className={styles.title}>Senior Research Scientist @ Quantum AI Labs</p>
            <div className={styles.metaInfo}>
              <span><MapPin size={16}/> Boston, MA</span>
              <span><Building2 size={16}/> MIT Alumni</span>
              <a href="#" className={styles.link}><LinkIcon size={16}/> sarahchen.dev</a>
            </div>
          </div>
          <div className={styles.actionButtons}>
             <button className={styles.primaryBtn}>Collaborate</button>
             <button className={styles.secondaryBtn}>Follow</button>
          </div>
        </div>
      </header>

      <div className={styles.profileGrid}>
        <div className={styles.mainContent}>
          <section className={`glass ${styles.section}`}>
            <h2 className={styles.sectionTitle}>About</h2>
            <p className={styles.aboutText}>
              I focus on the intersection of quantum computing and neural networks. Currently leading a team of 12 researchers exploring optimization algorithms for near-term quantum devices. Open to collaborations in chemical simulation and financial modeling.
            </p>
          </section>

          <section className={`glass ${styles.section}`}>
            <h2 className={styles.sectionTitle}>Featured Publications</h2>
            <div className={styles.publicationList}>
              <div className={styles.publicationItem}>
                <BookOpen size={24} className={styles.pubIcon}/>
                <div className={styles.pubDetails}>
                   <h3>Neural Networks for Quantum Chemistry</h3>
                   <p className={styles.pubMeta}>Nature Physics • 2025 • 248 Citations</p>
                   <p className={styles.pubAbstract}>A novel architecture reducing training times by 40% when simulating molecular dynamics on NISQ hardware.</p>
                </div>
              </div>
              <div className={styles.publicationItem}>
                <BookOpen size={24} className={styles.pubIcon}/>
                <div className={styles.pubDetails}>
                   <h3>Quantum Error Correction with Transformers</h3>
                   <p className={styles.pubMeta}>arXiv • 2024 • 112 Citations</p>
                   <p className={styles.pubAbstract}>Applying transformer-based models to predict and mitigate errors in superconducting qubits.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className={styles.sidebarContent}>
          <section className={`glass ${styles.section}`}>
             <h2 className={styles.sectionTitle}>Credibility Graph</h2>
             <div className={styles.graphVisualization}>
                <div className={styles.graphMetrics}>
                   <div className={styles.gMetric}>
                      <span>H-Index</span>
                      <strong>28</strong>
                   </div>
                   <div className={styles.gMetric}>
                      <span>Citations</span>
                      <strong>1,402</strong>
                   </div>
                   <div className={styles.gMetric}>
                      <span>Reviews</span>
                      <strong>45</strong>
                   </div>
                </div>
                {/* CSS visual graph representation */}
                <div className={styles.radarGraph}>
                   <div className={styles.radarGrid}></div>
                   <div className={styles.radarArea}></div>
                   <div className={styles.radarPoint} style={{top: '10%', left: '50%'}}></div>
                   <div className={styles.radarPoint} style={{top: '70%', left: '80%'}}></div>
                   <div className={styles.radarPoint} style={{top: '70%', left: '20%'}}></div>
                </div>
             </div>
          </section>

          <section className={`glass ${styles.section}`}>
             <h2 className={styles.sectionTitle}>Top Skills</h2>
             <div className={styles.skillsList}>
                <span className={styles.skillBadge}>Quantum Computing <span className={styles.skillCount}>98</span></span>
                <span className={styles.skillBadge}>Machine Learning <span className={styles.skillCount}>84</span></span>
                <span className={styles.skillBadge}>Python <span className={styles.skillCount}>76</span></span>
                <span className={styles.skillBadge}>Qiskit <span className={styles.skillCount}>62</span></span>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}

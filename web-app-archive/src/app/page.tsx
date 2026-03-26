import { TrendingUp, Eye, FileText, Share2, MessageSquare } from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  const metrics = [
    { label: "Global Impact Score", value: "98.4", trend: "+2.1", icon: TrendingUp, color: "var(--accent-color)" },
    { label: "Profile Views", value: "1,248", trend: "+12%", icon: Eye, color: "#10b981" },
    { label: "Publications", value: "34", trend: "+1", icon: FileText, color: "#f59e0b" },
  ];

  const feedItems = [
    {
      id: 1,
      author: "Dr. Sarah Chen",
      action: "cited your paper",
      target: "Neural Networks for Quantum Chemistry",
      time: "2h ago",
      content: "This paper provides a brilliant foundation for our new model architectures. We've managed to reduce training times by 40% using the proposed methodologies.",
      likes: 24,
      comments: 5
    },
    {
      id: 2,
      author: "System AI",
      action: "found a collaboration match",
      target: "Based on your recent work in ML",
      time: "5h ago",
      content: "Dr. James Wilson is currently working on similar datasets and looking for ML expertise to assist with a new grant proposal. Match probability: 94%.",
      likes: 0,
      comments: 0,
      isAi: true
    }
  ];

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome back, Researcher</h1>
        <p className={styles.subtitle}>Here's what's happening in your ecosystem today.</p>
      </header>
      
      <section className={styles.metricsGrid}>
        {metrics.map((m, i) => (
          <div key={i} className={`glass ${styles.metricCard}`}>
            <div className={styles.metricHeader}>
              <span className={styles.metricLabel}>{m.label}</span>
              <m.icon size={20} color={m.color} />
            </div>
            <div className={styles.metricBody}>
              <span className={styles.metricValue}>{m.value}</span>
              <span className={styles.metricTrend}>{m.trend}</span>
            </div>
          </div>
        ))}
      </section>

      <section className={styles.feedSection}>
        <h2 className={styles.sectionTitle}>Your Research Feed</h2>
        <div className={styles.feed}>
          {feedItems.map(item => (
            <div key={item.id} className={`glass ${styles.feedCard} ${item.isAi ? styles.aiCard : ''}`}>
               <div className={styles.feedHeader}>
                 <div className={styles.feedAvatar}>{item.author.charAt(0)}</div>
                 <div className={styles.feedMeta}>
                   <span className={styles.feedAuthor}>{item.author}</span>
                   <span className={styles.feedAction}> {item.action} </span>
                   <span className={styles.feedTarget}>{item.target}</span>
                 </div>
                 <span className={styles.feedTime}>{item.time}</span>
               </div>
               <p className={styles.feedContent}>{item.content}</p>
               {!item.isAi && (
                 <div className={styles.feedActions}>
                   <button><Share2 size={16}/><span>{item.likes}</span></button>
                   <button><MessageSquare size={16}/><span>{item.comments}</span></button>
                 </div>
               )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

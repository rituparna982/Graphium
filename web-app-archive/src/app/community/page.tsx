import { UserPlus, X, Sparkles, MapPin, Building2, BookOpen } from "lucide-react";
import styles from "./community.module.css";

export default function Community() {
  const matches = [
    {
      id: 1,
      name: "Dr. James Wilson",
      title: "ML Researcher @ Stanford",
      matchScore: 94,
      mutual: "Quantum ML, Optimization",
      status: "Looking for ML expertise",
      location: "Stanford, CA"
    },
    {
      id: 2,
      name: "Elena Rodriguez",
      title: "Postdoc @ Max Planck Institute",
      matchScore: 88,
      mutual: "Neural Networks, Physics",
      status: "Open to collaborate",
      location: "Munich, Germany"
    },
    {
       id: 3,
       name: "Dr. Akira Tanaka",
       title: "Principal Scientist @ IBM Quantum",
       matchScore: 82,
       mutual: "NISQ Hardware, VQE",
       status: "Actively Hiring",
       location: "Yorktown Heights, NY"
    }
  ];

  return (
    <div className={styles.container}>
       <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Collaboration Matching</h1>
            <p className={styles.subtitle}>AI-driven recommendations based on your recent publications and skills.</p>
          </div>
          <div className={styles.aiBadge}>
             <Sparkles size={16} className={styles.aiIcon} />
             <span>Active</span>
          </div>
       </header>

       <div className={styles.matchGrid}>
          {matches.map(match => (
             <div key={match.id} className={`glass ${styles.matchCard}`}>
                <div className={styles.cardHeader}>
                   <div className={styles.avatar}>{match.name.charAt(0)}</div>
                   <div className={styles.matchScoreBadge}>
                      {match.matchScore}% Match
                   </div>
                </div>
                
                <h3 className={styles.name}>{match.name}</h3>
                <p className={styles.titleText}>{match.title}</p>
                
                <div className={styles.infoList}>
                   <div className={styles.infoRow}>
                      <MapPin size={16}/> <span>{match.location}</span>
                   </div>
                   <div className={styles.infoRow}>
                      <BookOpen size={16}/> <span>{match.mutual}</span>
                   </div>
                   <div className={styles.infoRow}>
                      <Building2 size={16}/> <span>{match.status}</span>
                   </div>
                </div>

                <div className={styles.actions}>
                   <button className={styles.skipBtn}><X size={20}/></button>
                   <button className={styles.connectBtn}><UserPlus size={20}/> Connect</button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
}

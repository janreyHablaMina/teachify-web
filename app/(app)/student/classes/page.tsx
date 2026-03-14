"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./classes.module.css";
import api from "@/lib/axios";

type StudentClass = {
  id: string;
  name: string;
  room: string;
  schedule: string;
  teacher?: {
    fullname: string;
  };
  students_count: number;
  join_code: string;
};

export default function MyClassesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get("/api/classrooms");
      setClasses(response.data);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cls.teacher?.fullname || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const colors = ["#fef08a", "#dbeafe", "#dcfce7", "#fae8ff", "#fed7aa", "#ffedd5"];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>My Classes</h1>
          <p>
            {isLoading ? "Loading your classrooms..." : 
             classes.length === 0 ? "You haven't joined any classes yet." : 
             `You are currently enrolled in ${classes.length} active classrooms.`}
          </p>
        </div>
        
        <div className={styles.actions}>
          <div className={styles.searchWrapper}>
            <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search classes or teachers..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button className={styles.joinBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14m-7-7v14"/>
            </svg>
            Join New Class
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className={styles.grid}>
          {[1, 2, 3].map(i => (
            <div key={i} className={styles.classCard} style={{ opacity: 0.5, pointerEvents: 'none' }}>
              <div className={styles.cardHeader} style={{ backgroundColor: '#f1f5f9' }}>
                <div style={{ height: 24, width: '60%', background: '#e2e8f0', borderRadius: 4 }} />
              </div>
              <div className={styles.cardBody}>
                <div style={{ height: 16, width: '40%', background: '#f1f5f9', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      ) : filteredClasses.length > 0 ? (
        <div className={styles.grid}>
          {filteredClasses.map((cls, index) => (
            <Link href={`/student/classes/${cls.id}`} key={cls.id} className={styles.classCard}>
              <div className={styles.cardHeader} style={{ backgroundColor: colors[index % colors.length] }}>
                <span className={styles.groupLabel}>{cls.room || 'General'}</span>
                <h3 className={styles.classTitle}>{cls.name}</h3>
                <div className={styles.teacherInfo}>
                  <div className={styles.teacherAvatar}>{(cls.teacher?.fullname || "T")[0]}</div>
                  <span className={styles.teacherName}>{cls.teacher?.fullname || "Teacher"}</span>
                </div>
              </div>
              
              <div className={styles.cardBody}>
                <div className={styles.statsRow}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Students</span>
                    <span className={styles.statValue}>{cls.students_count}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Schedule</span>
                    <span className={styles.statValue}>{cls.schedule || "Not set"}</span>
                  </div>
                </div>
                
                <div className={styles.progressSection}>
                  <div className={styles.progressHeader}>
                    <span className={styles.statLabel}>Join Code</span>
                    <span className={styles.statValue} style={{ letterSpacing: '0.1em' }}>{cls.join_code}</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div 
                      className={styles.progressFill} 
                      style={{ width: `100%`, opacity: 0.1 }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>{searchQuery ? "🔍" : "📚"}</span>
          <h2 className={styles.emptyTitle}>{searchQuery ? "No classes found" : "Your classroom is empty"}</h2>
          <p className={styles.emptySub}>
            {searchQuery 
              ? `We couldn't find any classes matching "${searchQuery}".`
              : "You haven't joined any classes yet. Use a join code from your teacher to get started!"}
          </p>
          {searchQuery ? (
            <button className={styles.joinBtn} onClick={() => setSearchQuery("")}>
              Clear Search
            </button>
          ) : (
            <button className={styles.joinBtn}>
              Join a Class
            </button>
          )}
        </div>
      )}
    </div>
  );
}

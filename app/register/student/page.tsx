"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import styles from "./student-register.module.css";

export default function StudentRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    password: "",
    password_confirmation: "",
    join_code: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Join code is intentionaly not pre-filled so students have to "match" it manually
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/api/register-student", formData);
      router.push("/teacher"); // Redirect to dashboard or student-specific area
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <img src="/teachify-logo.png" alt="Logo" />
          <h1>Student <span className={styles.hl}>Join Room</span></h1>
          <p>Register and start taking quizzes assigned by your teacher.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorBanner}>{error}</div>}

          <div className={styles.grid}>
            <div className={styles.field}>
              <label>First Name</label>
              <input 
                type="text" 
                required 
                value={formData.firstname}
                onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                placeholder="Juan"
              />
            </div>
            <div className={styles.field}>
              <label>Middle Name</label>
              <input 
                type="text" 
                value={formData.middlename}
                onChange={(e) => setFormData({...formData, middlename: e.target.value})}
                placeholder="Protacio"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Last Name</label>
            <input 
              type="text" 
              required 
              value={formData.lastname}
              onChange={(e) => setFormData({...formData, lastname: e.target.value})}
              placeholder="Rizal"
            />
          </div>

          <div className={styles.field}>
            <label>Email Address</label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="juan@student.com"
            />
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Password</label>
              <input 
                type="password" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="********"
              />
            </div>
            <div className={styles.field}>
              <label>Confirm Password</label>
              <input 
                type="password" 
                required 
                value={formData.password_confirmation}
                onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                placeholder="********"
              />
            </div>
          </div>

          <div className={styles.fieldJoinCode}>
            <label>Join Code</label>
            <input 
              type="text" 
              required 
              maxLength={6}
              value={formData.join_code}
              onChange={(e) => setFormData({...formData, join_code: e.target.value.toUpperCase()})}
              placeholder="ABC123"
            />
          </div>

          <button type="submit" disabled={loading} className={styles.btnSubmit}>
            {loading ? "Joining..." : "Join Classroom"}
          </button>

          <p className={styles.footer}>
            Already have an account? <Link href="/login">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

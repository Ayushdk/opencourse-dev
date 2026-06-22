import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  initializeAdminAuth,
  loginAdmin,
} from "../../redux/slice/adminSlice";

export default function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { admin, loading, error } = useAppSelector((state) => state.admin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    void dispatch(initializeAdminAuth());
  }, [dispatch]);

  useEffect(() => {
    if (admin) navigate("/admin/dashboard", { replace: true });
  }, [admin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (!email.trim() || !password) {
      setLocalError("Email and password are required.");
      return;
    }
    try {
      await dispatch(
        loginAdmin({
          email: email.trim(),
          password,
        }),
      ).unwrap();
      navigate("/admin/dashboard", { replace: true });
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : "Admin login failed.");
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex" style={{ background: "#02020a" }}>
      {/* Left — branding panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-105 shrink-0 p-10 relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0a0a14 0%, #0d0d1a 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* ambient glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "30%",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(94,106,210,0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <div>
          <div className="flex items-center gap-2 mb-16">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #5E6AD2, #8B5CF6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: 18, color: "#ededef", letterSpacing: "-0.02em" }}>
              OpenCourse
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: "#8B5CF6",
                background: "rgba(139,92,246,0.12)",
                padding: "2px 8px",
                borderRadius: 6,
                marginLeft: 4,
              }}
            >
              ADMIN
            </span>
          </div>

          <h1
            style={{
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.15,
              color: "#ededef",
              marginBottom: 16,
            }}
          >
            Admin<br />
            <span
              style={{
                background: "linear-gradient(135deg, #5E6AD2, #8B5CF6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Control Panel
            </span>
          </h1>
          <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.6 }}>
            Restricted access. Only authorised administrators may proceed.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { icon: "👥", label: "User & contributor management" },
            { icon: "🎬", label: "Video & content moderation" },
            { icon: "📚", label: "Course & topic creation" },
            { icon: "✅", label: "Contributor application review" },
          ].map((f) => (
            <div
              key={f.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span style={{ fontSize: 18 }}>{f.icon}</span>
              <span style={{ color: "#a1a1aa", fontSize: 13 }}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* Lock icon */}
          <div className="flex justify-center mb-8">
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "linear-gradient(135deg, rgba(94,106,210,0.2), rgba(139,92,246,0.2))",
                border: "1px solid rgba(94,106,210,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 40px rgba(94,106,210,0.2)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5E6AD2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>

          <h2
            style={{
              textAlign: "center",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#ededef",
              marginBottom: 6,
            }}
          >
            Administrator Login
          </h2>
          <p style={{ textAlign: "center", color: "#6b7280", fontSize: 14, marginBottom: 32 }}>
            Sign in with your administrator credentials.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#a1a1aa", marginBottom: 6 }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@opencourse.dev"
                autoComplete="email"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#ededef",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#5E6AD2")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#a1a1aa", marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#ededef",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#5E6AD2")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            {/* Error */}
            {displayError && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#f87171",
                  fontSize: 13,
                }}
              >
                {displayError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 12,
                border: "none",
                background: loading
                  ? "rgba(94,106,210,0.4)"
                  : "linear-gradient(135deg, #5E6AD2, #8B5CF6)",
                color: "white",
                fontWeight: 600,
                fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow: loading ? "none" : "0 8px 30px rgba(94,106,210,0.35)",
                marginTop: 4,
              }}
            >
              {loading ? "Authenticating…" : "Sign in as Administrator"}
            </button>
          </form>

          {/* Security note */}
          <div
            style={{
              marginTop: 28,
              padding: "14px 16px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" style={{ marginTop: 1, flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.5 }}>
              This page is not linked anywhere in the app. Only administrators who know this URL can access it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

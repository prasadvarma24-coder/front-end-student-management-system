
import { useMemo, useState } from "react";
import {
  LayoutDashboard, ChartNoAxesCombined, Users, BookOpen,
  CalendarDays, Settings, Search, Bell, Sun, Moon,
  ArrowUpRight, ArrowDownRight, Clock3, Target,
  GraduationCap, CheckCircle2, Menu, X, ChevronDown,
  Download, Activity, CircleHelp
} from "lucide-react";

import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell
} from "recharts";

import "./App.css";

const performanceData = [
  { day: "Mon", score: 62, previous: 55 },
  { day: "Tue", score: 70, previous: 61 },
  { day: "Wed", score: 66, previous: 58 },
  { day: "Thu", score: 78, previous: 65 },
  { day: "Fri", score: 73, previous: 69 },
  { day: "Sat", score: 88, previous: 75 },
  { day: "Sun", score: 94, previous: 80 }
];

const activityData = [
  { day: "Mon", hours: 3.5 },
  { day: "Tue", hours: 5.2 },
  { day: "Wed", hours: 4.1 },
  { day: "Thu", hours: 7.4 },
  { day: "Fri", hours: 6.2 },
  { day: "Sat", hours: 8.5 },
  { day: "Sun", hours: 5.8 }
];

const initialStudents = [
  { id: 1, name: "Rahul", course: "UI/UX Design", score: 94, status: "Excellent", color: "violet" },
  { id: 2, name: "Shiva", course: "React Development", score: 87, status: "Excellent", color: "blue" },
  { id: 3, name: "Fouzan", course: "Data Analytics", score: 76, status: "Good", color: "pink" },
  { id: 4, name: "Satya", course: "Python Programming", score: 68, status: "Improving", color: "orange" }
];

const navigation = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Performance", icon: ChartNoAxesCombined },
  { name: "Students", icon: Users },
  { name: "Courses", icon: BookOpen },
  { name: "Activity", icon: CalendarDays }
];

function StatCard({ title, value, change, icon: Icon, color, negative = false }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <div className={`stat-icon ${color}`}><Icon size={21} /></div>
        <span className={`change ${negative ? "negative" : ""}`}>
          {negative ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}
          {change}
        </span>
      </div>
      <p className="stat-label">{title}</p>
      <h2 className="stat-value">{value}</h2>
      <p className="stat-foot">Compared with last month</p>
    </article>
  );
}

function ProgressRing({ title, percent, color, subtitle }) {
  const ringData = [
    { name: "Complete", value: percent },
    { name: "Remaining", value: 100 - percent }
  ];

  return (
    <div className="progress-item">
      <div className="progress-ring">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={ringData}
              dataKey="value"
              innerRadius="78%"
              outerRadius="96%"
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill="var(--ring-track)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <strong>{percent}%</strong>
      </div>
      <h4>{title}</h4>
      <p>{subtitle}</p>
    </div>
  );
}

function App() {
  const [dark, setDark] = useState(true);
  const [activePage, setActivePage] = useState("Overview");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("This week");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState(false);

  const students = useMemo(
    () => initialStudents.filter(student =>
      `${student.name} ${student.course} ${student.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    ),
    [search]
  );

  const stats = [
    { title: "Total Students", value: "2,840", change: "12.8%", icon: Users, color: "violet" },
    { title: "Average GPA", value: "3.78", change: "8.2%", icon: GraduationCap, color: "blue" },
    { title: "Attendance Rate", value: "94.6%", change: "2.4%", icon: CheckCircle2, color: "green" },
    { title: "Study Hours", value: "1,284", change: "5.1%", icon: Clock3, color: "pink", negative: true }
  ];

  function exportReport() {
    const rows = [
      ["Student", "Course", "Score", "Status"],
      ...students.map(student => [
        student.name, student.course, student.score, student.status
      ])
    ];

    const csv = rows
      .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "analytics-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={`analytics-app ${dark ? "dark" : "light"}`}>
      {mobileMenu && (
        <button className="mobile-overlay" onClick={() => setMobileMenu(false)} aria-label="Close menu" />
      )}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><GraduationCap size={24} /></div>
          <div><strong>SMS</strong><span>LEARNING ANALYTICS</span></div>
          <button className="close-menu" onClick={() => setMobileMenu(false)}><X /></button>
        </div>

        <p className="nav-caption">WORKSPACE</p>
        <nav className="navigation">
          {navigation.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-link ${activePage === name ? "active" : ""}`}
              onClick={() => {
                setActivePage(name);
                setMobileMenu(false);
              }}
            >
              <Icon size={19} />
              <span>{name}</span>
              {name === "Students" && <span className="nav-count">24</span>}
            </button>
          ))}
        </nav>

        <p className="nav-caption second-caption">PREFERENCES</p>
        <button className="nav-link" onClick={() => setActivePage("Settings")}>
          <Settings size={19} /><span>Settings</span>
        </button>
        <button className="nav-link" onClick={() => alert("Help center demo")}>
          <CircleHelp size={19} /><span>Help center</span>
        </button>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon"><Activity size={20} /></div>
            <strong>Unlock insights</strong>
            <p>Explore your learning data in more detail.</p>
            <button onClick={() => alert("Upgrade demo")}>Explore features ↗</button>
          </div>
          <div className="profile-row">
            <div className="profile-avatar">PV</div>
            <div className="profile-info"><strong>K Prasad Varma</strong><span>Administrator</span></div>
            <ChevronDown size={15} />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMobileMenu(true)} aria-label="Open menu">
            <Menu />
          </button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{activePage}</strong></div>

          <div className="topbar-actions">
            <label className="search-box">
              <Search size={17} />
              <input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search students..."
              />
              <kbd>⌘ K</kbd>
            </label>
            <button className="icon-button" onClick={() => setDark(!dark)} title="Toggle theme">
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <div className="notification-wrap">
              <button className="icon-button notification-button" onClick={() => setNotifications(!notifications)} aria-label="Notifications">
                <Bell size={19} /><i />
              </button>
              {notifications && (
                <div className="notification-panel">
                  <strong>Notifications</strong>
                  <p>Weekly performance report is ready.</p>
                  <p>12 students improved their scores.</p>
                </div>
              )}
            </div>
            <div className="top-avatar">PV</div>
          </div>
        </header>

        <section className="page-content">
          <div className="page-heading">
            <div>
              <span className="eyebrow"><Activity size={14} /> ANALYTICS OVERVIEW</span>
              <h1>Analytics Dashboard</h1>
              <p>Track performance, monitor progress, and discover learning insights.</p>
            </div>
            <div className="heading-actions">
              <label className="period-select">
                <CalendarDays size={16} />
                <select value={period} onChange={event => setPeriod(event.target.value)}>
                  <option>This week</option>
                  <option>This month</option>
                  <option>This year</option>
                </select>
              </label>
              <button className="primary-button" onClick={exportReport}>
                <Download size={16} /> Export report
              </button>
            </div>
          </div>

          {activePage !== "Overview" && (
            <div className="page-notice">
              <strong>{activePage}</strong>
              <span>This interactive demo uses the shared analytics dashboard layout.</span>
              <button onClick={() => setActivePage("Overview")}>Back to overview</button>
            </div>
          )}

          <div className="stats-grid">
            {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
          </div>

          <div className="charts-grid">
            <section className="dashboard-card performance-card">
              <div className="card-heading">
                <div><h3>Performance overview</h3><p>Average assessment scores over time</p></div>
                <button className="dots-button" onClick={() => alert("Performance chart options")}>•••</button>
              </div>
              <div className="chart-legend">
                <span><i className="legend-dot violet-dot" /> This period</span>
                <span><i className="legend-dot gray-dot" /> Previous period</span>
              </div>
              <div className="performance-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData} margin={{ top: 10, right: 5, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 5" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "var(--tooltip-bg)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--text)", fontSize: 12 }} />
                    <Area type="monotone" dataKey="previous" name="Previous period" stroke="#8c879c" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                    <Area type="monotone" dataKey="score" name="This period" stroke="#9872ff" strokeWidth={3} fill="url(#scoreFill)" activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-summary">
                <span><strong>82.4%</strong> average score</span>
                <span className="positive-text"><ArrowUpRight size={15} /> 12.6% vs previous period</span>
              </div>
            </section>

            <section className="dashboard-card progress-card">
              <div className="card-heading">
                <div><h3>Learning progress</h3><p>Overall learning objectives</p></div>
                <Target size={19} className="heading-icon" />
              </div>
              <div className="progress-rings">
                <ProgressRing title="Courses" percent={78} color="#9872ff" subtitle="12 of 16 completed" />
                <ProgressRing title="Assignments" percent={86} color="#ec4899" subtitle="43 of 50 completed" />
                <ProgressRing title="Attendance" percent={95} color="#22c58b" subtitle="Excellent progress" />
              </div>
              <div className="progress-footer">
                <span>Overall completion</span><strong>86%</strong>
              </div>
              <div className="linear-track"><span style={{ width: "86%" }} /></div>
              <p className="progress-note"><CheckCircle2 size={15} /> You're ahead of your monthly target!</p>
            </section>
          </div>

          <div className="lower-grid">
            <section className="dashboard-card activity-card">
              <div className="card-heading">
                <div><h3>Learning activity</h3><p>Hours spent studying each day</p></div>
                <button className="text-button" onClick={() => alert("Full activity history demo")}>View details ↗</button>
              </div>
              <div className="activity-total"><strong>40.7h</strong><span className="positive-text">+8.4% this week</span></div>
              <div className="activity-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData} margin={{ top: 10, right: 5, left: -18, bottom: 0 }}>
                    <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 5" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} dy={8} />
                    <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "var(--tooltip-bg)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--text)", fontSize: 12 }} />
                    <Bar dataKey="hours" name="Study hours" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="dashboard-card goals-card">
              <div className="card-heading">
                <div><h3>Weekly study goal</h3><p>Your learning target</p></div>
                <Target size={19} className="heading-icon" />
              </div>
              <div className="goal-number"><strong>40.7</strong><span> / 50 hours</span></div>
              <div className="linear-track goal-track"><span style={{ width: "81.4%" }} /></div>
              <p className="goal-caption">You've completed <strong>81%</strong> of your weekly goal.</p>
              <div className="goal-breakdown">
                <div><span className="goal-dot purple-dot" /><span>Completed</span><strong>40.7 h</strong></div>
                <div><span className="goal-dot gray-dot" /><span>Remaining</span><strong>9.3 h</strong></div>
              </div>
              <div className="goal-tip"><Activity size={17} /><span>Study for 1.5 more hours daily to reach your goal.</span></div>
            </section>
          </div>

          <section className="dashboard-card students-card">
            <div className="card-heading">
              <div><h3>Student performance</h3><p>Latest assessment results and progress</p></div>
              <button className="text-button" onClick={exportReport}><Download size={15} /> Export CSV</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>STUDENT</th><th>COURSE</th><th>SCORE</th><th>PERFORMANCE</th><th>STATUS</th></tr></thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td><div className="student-cell"><span className={`student-initial ${student.color}`}>{student.name.split(" ").map(n => n[0]).join("")}</span><strong>{student.name}</strong></div></td>
                      <td>{student.course}</td>
                      <td><strong>{student.score}%</strong></td>
                      <td><div className="table-progress"><span style={{ width: `${student.score}%` }} /></div></td>
                      <td><span className={`status-badge ${student.status.toLowerCase()}`}>{student.status}</span></td>
                    </tr>
                  ))}
                  {students.length === 0 && <tr><td colSpan="5" className="empty-state">No students match your search.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <span>Showing {students.length} of {initialStudents.length} sample students</span>
              <button onClick={() => setSearch("")}>Clear search</button>
            </div>
          </section>

          <footer className="dashboard-footer">
            <span>© 2026 SMS Analytics</span>
            <span>Built with React · Recharts</span>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;

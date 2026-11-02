import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldAlert,
  Building2,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  ArrowUpDown,
  Download,
  Moon,
  Sun,
  FileText,
  Printer,
  Copy,
  Sliders,
  Award,
  Layers,
  ChevronRight,
  RefreshCw,
  Briefcase,
  X,
  PieChart as PieIcon,
  Check,
  Star,
  Code2
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

// --- DATA TYPES & INTERFACES ---
export interface ProjectItem {
  id: number;
  ref: string;
  cat: string;
  desc: string;
  method: 'Tender Terbuka' | 'Sebut Harga' | 'Lantikan Terus' | string;
  contractor: string;
  value: number;
  start: string;
  end: string;
  targetProgress: number;
  actualProgress: number;
  status: 'Selesai' | 'Dalam Pelaksanaan' | 'Lewat Jadual' | string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4' | string;
  pic: string;
  location: string;
  notes: string;
}

export interface BudgetItem {
  code: string;
  desc: string;
  original: number;
  revised: number;
  net: number;
  spent: number;
  status: 'Tinggi' | 'Optimum' | 'Rendah' | string;
}

export interface ContractorEvalItem {
  id: number;
  name: string;
  project: string;
  quality: number;
  timing: number;
  safety: number;
  management: number;
  grade: 'A' | 'B' | 'C' | 'D' | string;
  review: string;
}

// --- INITIAL DATA SOURCE (JKR PENTADBIRAN 2026) ---
const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 1,
    ref: "JKR/ADM/2026/01",
    cat: "Penyelenggaraan Lif",
    desc: "Servis Berjadual & Alat Ganti Lif Menara Blok A",
    method: "Sebut Harga",
    contractor: "Elevate Engineering Sdn Bhd",
    value: 88000,
    start: "2026-01-01",
    end: "2026-12-31",
    targetProgress: 85,
    actualProgress: 75,
    status: "Dalam Pelaksanaan",
    quarter: "Q1",
    pic: "En. Khairul Azhar (Jurutera Mekanikal)",
    location: "Blok A, Tingkat 1-12",
    notes: "Pemeriksaan berjadual DOSH telah diluluskan pada 15 Ogos 2026."
  },
  {
    id: 2,
    ref: "JKR/ADM/2026/02",
    cat: "Pembersihan Bangunan",
    desc: "Perkhidmatan Kebersihan & Sanitasi Menyeluruh Pejabat",
    method: "Tender Terbuka",
    contractor: "Kilauan Bersih Enterprise",
    value: 380000,
    start: "2026-01-01",
    end: "2026-12-31",
    targetProgress: 75,
    actualProgress: 70,
    status: "Dalam Pelaksanaan",
    quarter: "Q1",
    pic: "Pn. Norazlina (Penolong Pegawai Tadbir)",
    location: "Kompleks Pentadbiran Cawangan",
    notes: "Bekalan bahan kimia pembersihan mesra alam (Green Cert) mematuhi piawaian."
  },
  {
    id: 3,
    ref: "JKR/ADM/2026/03",
    cat: "Kawalan Keselamatan",
    desc: "Perkhidmatan Pengawal Keselamatan Beruniform 24/7",
    method: "Tender Terbuka",
    contractor: "Wira Perkasa Security Services",
    value: 420000,
    start: "2026-01-01",
    end: "2026-12-31",
    targetProgress: 75,
    actualProgress: 75,
    status: "Dalam Pelaksanaan",
    quarter: "Q1",
    pic: "En. Saiful Bahari (Ketua Seksyen Keselamatan)",
    location: "Pintu Masuk Utama, Pintu Belakang & Pos Kawalan",
    notes: "Pengoperasian 12 jam bersyif berjalan mengikut jadual."
  },
  {
    id: 4,
    ref: "JKR/ADM/2026/04",
    cat: "Sistem Pendingin Hawa",
    desc: "Servis Berjadual Chiller & Air Handling Unit (AHU)",
    method: "Sebut Harga",
    contractor: "Maju Sejuk Teknik Sdn Bhd",
    value: 165000,
    start: "2026-01-15",
    end: "2026-10-14",
    targetProgress: 100,
    actualProgress: 100,
    status: "Selesai",
    quarter: "Q1",
    pic: "Pn. Siti Fatimah (Jurutera Mekanikal)",
    location: "Bilik Loji Tingkat Bawah Tanah",
    notes: "Sijil Perakuan Siap Kerja (CPC) telah dikeluarkan pada 12 Okt 2026."
  },
  {
    id: 5,
    ref: "JKR/ADM/2026/05",
    cat: "Peralatan ICT",
    desc: "Langganan Lesen Perisian Kejuruteraan & Khidmat Pelayan",
    method: "Lantikan Terus",
    contractor: "DataSync System Solutions",
    value: 48000,
    start: "2026-02-01",
    end: "2026-07-31",
    targetProgress: 100,
    actualProgress: 100,
    status: "Selesai",
    quarter: "Q1",
    pic: "En. Hafizul (Pegawai Teknologi Maklumat)",
    location: "Pusat Data JKR",
    notes: "Migrasi pangkalan data sistem berjaya diselesaikan tanpa gangguan."
  },
  {
    id: 6,
    ref: "JKR/ADM/2026/06",
    cat: "Perabot & Kelengkapan",
    desc: "Pembekalan Stesen Kerja Ergonomik & Meja Mesyuarat",
    method: "Sebut Harga",
    contractor: "Perabot Megah Jaya Sdn Bhd",
    value: 72000,
    start: "2026-03-01",
    end: "2026-05-30",
    targetProgress: 100,
    actualProgress: 100,
    status: "Selesai",
    quarter: "Q1",
    pic: "Pn. Rosnah (Penolong Pegawai Tadbir)",
    location: "Bilik Seminar Aras 3 & Pejabat Terbuka",
    notes: "Pemeriksaan fizikal dan pendaftaran aset KEW.PA-3 telah selesai."
  },
  {
    id: 7,
    ref: "JKR/ADM/2026/07",
    cat: "Mesin Cetak & Salinan",
    desc: "Sewaan & Selenggaraan Mesin Fotostat Berbilang Fungsi",
    method: "Lantikan Terus",
    contractor: "Infotech Imaging Sdn Bhd",
    value: 20000,
    start: "2026-01-01",
    end: "2026-12-31",
    targetProgress: 80,
    actualProgress: 80,
    status: "Dalam Pelaksanaan",
    quarter: "Q1",
    pic: "En. Nazirul (Seksyen Logistik)",
    location: "Semua Cawangan Tingkat 1-5",
    notes: "Toner gantian dihantar berkala mengikut perjanjian SLA."
  },
  {
    id: 8,
    ref: "JKR/ADM/2026/08",
    cat: "Pembaikan Bangunan",
    desc: "Kerja Mengecat & Pembaikan Fasad Blok Pentadbiran Utama",
    method: "Sebut Harga",
    contractor: "Puncak Bina Enterprise",
    value: 145000,
    start: "2026-04-15",
    end: "2026-10-15",
    targetProgress: 70,
    actualProgress: 32,
    status: "Lewat Jadual",
    quarter: "Q2",
    pic: "Ir. Wan Ahmad (Jurutera Awam Kanan)",
    location: "Dinding Luar Fasad Blok Pentadbiran",
    notes: "Kelewatan kritikal (-38%). Kekurangan tenaga kerja perancah dan hujan lebat."
  },
  {
    id: 9,
    ref: "JKR/ADM/2026/09",
    cat: "Latihan Kakitangan",
    desc: "Kursus Pemantapan Tatatertib & Integriti Pentadbiran JKR",
    method: "Sebut Harga",
    contractor: "Akademi Integriti Malaysia",
    value: 28000,
    start: "2026-05-10",
    end: "2026-05-12",
    targetProgress: 100,
    actualProgress: 100,
    status: "Selesai",
    quarter: "Q2",
    pic: "Pn. Norazlina (Seksyen Latihan Pentadbiran)",
    location: "Pusat Latihan Kejuruteraan JKR",
    notes: "Disertai oleh seramai 85 orang pegawai dan kakitangan sokongan."
  },
  {
    id: 10,
    ref: "JKR/ADM/2026/10",
    cat: "Kenderaan Jabatan",
    desc: "Selenggaraan Rutin, Tayar & Insurans Armada Pacuan 4 Roda",
    method: "Sebut Harga",
    contractor: "AutoServis Unggul Sdn Bhd",
    value: 90000,
    start: "2026-01-01",
    end: "2026-12-31",
    targetProgress: 75,
    actualProgress: 60,
    status: "Dalam Pelaksanaan",
    quarter: "Q1",
    pic: "En. Jamal (Seksyen Pengangkutan)",
    location: "Bengkel Berdaftar & Depo JKR",
    notes: "Pemeriksaan berkala PUSPAKOM berjalan tanpa insiden."
  },
  {
    id: 11,
    ref: "JKR/ADM/2026/11",
    cat: "Rangkaian & Komunikasi",
    desc: "Naik Taraf Titik Akses Wi-Fi 6 & Kabel Rangkaian Gentian Optik",
    method: "Tender Terbuka",
    contractor: "TechZone Systems Sdn Bhd",
    value: 510000,
    start: "2026-06-01",
    end: "2026-11-30",
    targetProgress: 65,
    actualProgress: 52,
    status: "Dalam Pelaksanaan",
    quarter: "Q2",
    pic: "En. Hafizul (Pegawai IT)",
    location: "Seluruh Kompleks Ibu Pejabat",
    notes: "Pemasangan kabel gentian optik teras utama telah siap 80%."
  },
  {
    id: 12,
    ref: "JKR/ADM/2026/12",
    cat: "Pencegah Kebakaran",
    desc: "Penggantian Sistem Pencegah Kebakaran & Injap Basah Automatik",
    method: "Tender Terbuka",
    contractor: "SafeGuard Fire Solutions Sdn Bhd",
    value: 320000,
    start: "2026-03-01",
    end: "2026-11-30",
    targetProgress: 80,
    actualProgress: 45,
    status: "Lewat Jadual",
    quarter: "Q1",
    pic: "Ir. Mohd Shukri (Jurutera Mekanikal Penguasa)",
    location: "Bilik Pam Bomba & Zon Riser Bomba",
    notes: "Kelewatan penghantaran pam bomba bertekanan tinggi akibat isu logistik pelabuhan."
  }
];

const INITIAL_BUDGET: BudgetItem[] = [
  { code: "OA 10000", desc: "Emolumen Kakitangan Pentadbiran & Sokongan", original: 1850000, revised: 0, net: 1850000, spent: 1572500, status: "Tinggi" },
  { code: "OA 21000", desc: "Tuntutan Perjalanan, Elaun Lojing & Bertugas Rasmi", original: 120000, revised: 30000, net: 150000, spent: 112500, status: "Optimum" },
  { code: "OA 22000", desc: "Pengangkutan Barangan, Pindahan & Logistik", original: 45000, revised: 0, net: 45000, spent: 28000, status: "Optimum" },
  { code: "OA 23000", desc: "Utiliti Pejabat (Elektrik, Air, Telekomunikasi & Pos)", original: 480000, revised: 50000, net: 530000, spent: 445200, status: "Tinggi" },
  { code: "OA 24000", desc: "Sewaan Pejabat Cawangan & Mesin Cetak Fotostat", original: 310000, revised: 0, net: 310000, spent: 232500, status: "Optimum" },
  { code: "OA 26000", desc: "Bekalan Alat Tulis, Kertas Komputer & Stok Pejabat", original: 95000, revised: 15000, net: 110000, spent: 88000, status: "Tinggi" },
  { code: "OA 27000", desc: "Kawalan Keselamatan Beruniform & Kebersihan Bangunan", original: 650000, revised: 60000, net: 710000, spent: 532500, status: "Optimum" },
  { code: "OA 28000", desc: "Penyelenggaraan Aset Fizikal, Lif & Armada Kenderaan", original: 520000, revised: 50000, net: 570000, spent: 307800, status: "Rendah" },
  { code: "OA 29000", desc: "Khidmat Ikhtisas, Integriti, Hospitaliti & Keraian", original: 130000, revised: 0, net: 130000, spent: 51000, status: "Rendah" }
];

const MONTHLY_TREND_DATA = [
  { month: "Jan", sebenar: 310, sasaran: 350 },
  { month: "Feb", sebenar: 640, sasaran: 700 },
  { month: "Mac", sebenar: 1020, sasaran: 1050 },
  { month: "Apr", sebenar: 1380, sasaran: 1400 },
  { month: "Mei", sebenar: 1750, sasaran: 1750 },
  { month: "Jun", sebenar: 2190, sasaran: 2100 },
  { month: "Jul", sebenar: 2600, sasaran: 2450 },
  { month: "Ogo", sebenar: 2980, sasaran: 2800 },
  { month: "Sep", sebenar: 3210, sasaran: 3150 },
  { month: "Okt", sebenar: 3370.5, sasaran: 3500 },
  { month: "Nov", sebenar: null, sasaran: 3850 },
  { month: "Dis", sebenar: null, sasaran: 4405 }
];

const INITIAL_CONTRACTORS_EVAL: ContractorEvalItem[] = [
  { id: 1, name: "Elevate Engineering Sdn Bhd", project: "Penyelenggaraan Lif Blok A", quality: 4, timing: 4, safety: 5, management: 4, grade: "A", review: "Khidmat pantas dan sentiasa menepati jadual DOSH." },
  { id: 2, name: "Kilauan Bersih Enterprise", project: "Pembersihan Bangunan Ibu Pejabat", quality: 4, timing: 4, safety: 4, management: 4, grade: "B", review: "Pematuhan bahan cucian mesra alam baik." },
  { id: 3, name: "Puncak Bina Enterprise", project: "Kerja Mengecat & Fasad Blok Utama", quality: 2, timing: 1, safety: 3, management: 2, grade: "D", review: "Kelewatan ketara. Tenaga kerja tapak tidak mencukupi." },
  { id: 4, name: "SafeGuard Fire Solutions Sdn Bhd", project: "Penggantian Pencegah Kebakaran", quality: 3, timing: 2, safety: 4, management: 3, grade: "C", review: "Isu perolehan pam bomba mengganggu jadual pemasangan." }
];

export default function App() {
  // --- APPLICATION STATES ---
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'budget' | 'risk' | 'scorecard'>('dashboard');
  const [quarterFilter, setQuarterFilter] = useState<'ALL' | 'Q1' | 'Q2' | 'Q3' | 'Q4'>('ALL');
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [budgets, setBudgets] = useState<BudgetItem[]>(INITIAL_BUDGET);
  const [contractorEvals, setContractorEvals] = useState<ContractorEvalItem[]>(INITIAL_CONTRACTORS_EVAL);

  // Download Code Dropdown State
  const [showCodeDownloadMenu, setShowCodeDownloadMenu] = useState(false);

  // Search, Filter, Sort for Projects
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<keyof ProjectItem>('ref');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateProgressVal, setUpdateProgressVal] = useState<number>(0);
  const [projectToUpdate, setProjectToUpdate] = useState<ProjectItem | null>(null);

  // Quick Inline Step Adjustment (+5% / -5%)
  const handleQuickProgressStep = (projId: number, step: number) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projId) {
        const newVal = Math.min(100, Math.max(0, p.actualProgress + step));
        let newStatus = p.status;
        if (newVal >= 100) newStatus = 'Selesai';
        else if (p.targetProgress - newVal >= 15) newStatus = 'Lewat Jadual';
        else newStatus = 'Dalam Pelaksanaan';
        return { ...p, actualProgress: newVal, status: newStatus };
      }
      return p;
    }));
    triggerToast(`Kemajuan dilaraskan (${step > 0 ? '+' : ''}${step}%) secara langsung!`);
  };

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    desc: '',
    cat: 'Penyelenggaraan Bangunan',
    method: 'Sebut Harga',
    contractor: '',
    value: '',
    start: '2026-11-01',
    end: '2027-04-30',
    targetProgress: 10,
    actualProgress: 5,
    pic: 'En. Pegawai Tadbir Kanan',
    location: 'Ibu Pejabat JKR',
    notes: 'Kontrak baharu didaftarkan.'
  });

  // Warning Letter Modal
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [letterData, setLetterData] = useState({
    contractor: '',
    ref: '',
    project: '',
    delay: 0,
    date: '2 November 2026',
    instruction: 'Mengemukakan Pelan Pemulihan (Catch-Up Plan) dan penambahan tenaga kerja dalam tempoh 7 hari bekerja dari tarikh surat ini.'
  });

  // Virement / Kalkulator Pindaan Peruntukan State
  const [virementFrom, setVirementFrom] = useState("OA 28000");
  const [virementTo, setVirementTo] = useState("OA 23000");
  const [virementAmount, setVirementAmount] = useState<number | string>(25000);

  // Live Toast State
  const [toast, setToast] = useState<{ show: boolean; message: string; type: string }>({ show: false, message: '', type: 'success' });

  const triggerToast = (message: string, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  // Live Clock String
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleDateString('ms-MY', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).toUpperCase());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- DERIVED METRICS & FINANCIAL CALCULATIONS ---
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchSearch = p.contractor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.ref.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchMethod = methodFilter === 'ALL' || p.method === methodFilter;
      const matchQuarter = quarterFilter === 'ALL' || p.quarter === quarterFilter;
      return matchSearch && matchStatus && matchMethod && matchQuarter;
    }).sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return sortOrder === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [projects, searchQuery, statusFilter, methodFilter, quarterFilter, sortBy, sortOrder]);

  const totalNetBudget = useMemo(() => budgets.reduce((acc, b) => acc + b.net, 0), [budgets]);
  const totalSpentBudget = useMemo(() => budgets.reduce((acc, b) => acc + b.spent, 0), [budgets]);
  const totalBalanceBudget = totalNetBudget - totalSpentBudget;
  const overallAbsorptionRate = ((totalSpentBudget / totalNetBudget) * 100).toFixed(1);

  const delayedProjectsCount = useMemo(() => projects.filter(p => p.status === 'Lewat Jadual').length, [projects]);
  const completedProjectsCount = useMemo(() => projects.filter(p => p.status === 'Selesai').length, [projects]);
  const activeProjectsCount = useMemo(() => projects.filter(p => p.status === 'Dalam Pelaksanaan').length, [projects]);

  const avgPhysicalProgress = useMemo(() => {
    if (!projects.length) return '0.0';
    const sum = projects.reduce((acc, p) => acc + p.actualProgress, 0);
    return (sum / projects.length).toFixed(1);
  }, [projects]);

  // Chart Data: Status Projects
  const statusPieData = useMemo(() => [
    { name: 'Selesai', value: completedProjectsCount, color: '#10B981' },
    { name: 'Pelaksanaan', value: activeProjectsCount, color: '#38BDF8' },
    { name: 'Lewat Jadual', value: delayedProjectsCount, color: '#F43F5E' }
  ], [completedProjectsCount, activeProjectsCount, delayedProjectsCount]);

  // Chart Data: Procurement Method Values
  const procurementMethodData = useMemo(() => {
    const dataMap: Record<string, number> = { 'Tender Terbuka': 0, 'Sebut Harga': 0, 'Lantikan Terus': 0 };
    projects.forEach(p => {
      if (dataMap[p.method] !== undefined) {
        dataMap[p.method] += p.value;
      }
    });
    return Object.keys(dataMap).map(key => ({
      name: key,
      nilai: dataMap[key] / 1000 // In RM '000
    }));
  }, [projects]);

  // Handlers for Project Progress Adjustment
  const handleOpenUpdateModal = (project: ProjectItem) => {
    setProjectToUpdate(project);
    setUpdateProgressVal(project.actualProgress);
    setIsUpdateModalOpen(true);
  };

  const handleSaveProgress = () => {
    if (!projectToUpdate) return;
    const updated = projects.map(p => {
      if (p.id === projectToUpdate.id) {
        let newStatus = p.status;
        if (updateProgressVal >= 100) {
          newStatus = 'Selesai';
        } else if (p.targetProgress - updateProgressVal >= 15) {
          newStatus = 'Lewat Jadual';
        } else {
          newStatus = 'Dalam Pelaksanaan';
        }
        return {
          ...p,
          actualProgress: updateProgressVal,
          status: newStatus
        };
      }
      return p;
    });

    setProjects(updated);
    setIsUpdateModalOpen(false);
    triggerToast(`Kemajuan fizikal bagi ${projectToUpdate.ref} telah dikemas kini kepada ${updateProgressVal}%!`);
  };

  // Add Project Handler
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectForm.desc || !newProjectForm.contractor || !newProjectForm.value) {
      triggerToast('Sila lengkapkan maklumat wajib projek.', 'error');
      return;
    }

    const newId = projects.length + 1;
    const generatedRef = `JKR/ADM/2026/${String(newId).padStart(2, '0')}`;
    const valNum = parseFloat(newProjectForm.value);
    const actualP = Number(newProjectForm.actualProgress) || 0;
    const targetP = Number(newProjectForm.targetProgress) || 10;
    
    let calcStatus = 'Dalam Pelaksanaan';
    if (actualP >= 100) calcStatus = 'Selesai';
    else if (targetP - actualP >= 15) calcStatus = 'Lewat Jadual';

    const newEntry: ProjectItem = {
      id: newId,
      ref: generatedRef,
      cat: newProjectForm.cat,
      desc: newProjectForm.desc,
      method: newProjectForm.method,
      contractor: newProjectForm.contractor,
      value: valNum,
      start: newProjectForm.start,
      end: newProjectForm.end,
      targetProgress: targetP,
      actualProgress: actualP,
      status: calcStatus,
      quarter: 'Q3',
      pic: newProjectForm.pic,
      location: newProjectForm.location,
      notes: newProjectForm.notes
    };

    setProjects([newEntry, ...projects]);
    setIsNewProjectModalOpen(false);
    triggerToast(`Kontrak baharu ${generatedRef} berjaya didaftarkan ke dalam pangkalan data!`);
    setNewProjectForm({
      desc: '',
      cat: 'Penyelenggaraan Bangunan',
      method: 'Sebut Harga',
      contractor: '',
      value: '',
      start: '2026-11-01',
      end: '2027-04-30',
      targetProgress: 10,
      actualProgress: 5,
      pic: 'En. Pegawai Tadbir Kanan',
      location: 'Ibu Pejabat JKR',
      notes: 'Kontrak baharu didaftarkan.'
    });
  };

  // Virement (Pindaan Bajet) Simulator Handler
  const handleExecuteVirement = () => {
    if (virementFrom === virementTo) {
      triggerToast('Vot sumber dan vot penerima tidak boleh sama!', 'error');
      return;
    }
    const amt = typeof virementAmount === 'string' ? parseFloat(virementAmount) : virementAmount;
    if (!amt || amt <= 0) {
      triggerToast('Sila masukkan amaun pindaan yang sah.', 'error');
      return;
    }

    const fromItem = budgets.find(b => b.code === virementFrom);
    if (!fromItem || (fromItem.net - fromItem.spent) < amt) {
      triggerToast(`Baki dana ${fromItem ? fromItem.code : 'sumber'} tidak mencukupi untuk dipindahkan sebanyak RM ${amt.toLocaleString()}!`, 'error');
      return;
    }

    const updated = budgets.map(b => {
      if (b.code === virementFrom) {
        const newNet = b.net - amt;
        const newRate = (b.spent / newNet) * 100;
        return {
          ...b,
          net: newNet,
          revised: b.revised - amt,
          status: newRate > 80 ? 'Tinggi' : newRate >= 60 ? 'Optimum' : 'Rendah'
        };
      }
      if (b.code === virementTo) {
        const newNet = b.net + amt;
        const newRate = (b.spent / newNet) * 100;
        return {
          ...b,
          net: newNet,
          revised: b.revised + amt,
          status: newRate > 80 ? 'Tinggi' : newRate >= 60 ? 'Optimum' : 'Rendah'
        };
      }
      return b;
    });

    setBudgets(updated);
    triggerToast(`Simulasi Pindaan Peruntukan (Virement) RM ${amt.toLocaleString()} dari ${virementFrom} ke ${virementTo} berjaya diselaraskan!`);
  };

  // Click-to-Drilldown Filter Handlers
  const handleDrilldownStatus = (statusName: string) => {
    setStatusFilter(statusName);
    setActiveTab('projects');
    triggerToast(`Menapis senarai projek kepada status: "${statusName}"`);
  };

  const handleDrilldownMethod = (methodName: string) => {
    setMethodFilter(methodName);
    setActiveTab('projects');
    triggerToast(`Menapis senarai projek kepada kaedah: "${methodName}"`);
  };

  // Warning Letter Generator Setup
  const handleGenerateWarningLetter = (proj: ProjectItem) => {
    const delay = proj.targetProgress - proj.actualProgress;
    setLetterData({
      contractor: proj.contractor,
      ref: proj.ref,
      project: proj.desc,
      delay: delay > 0 ? delay : 25,
      date: new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' }),
      instruction: 'Mengemukakan Pelan Pemulihan (Catch-Up Plan) dan menambah bilangan tenaga kerja mahir di tapak selewat-lewatnya 7 hari bekerja.'
    });
    setIsLetterModalOpen(true);
  };

  // Contractor Rating Submission
  const handleUpdateRating = (id: number, field: keyof ContractorEvalItem, value: number) => {
    const updated = contractorEvals.map(c => {
      if (c.id === id) {
        const newObj = { ...c, [field]: value };
        const score = (newObj.quality + newObj.timing + newObj.safety + newObj.management) / 4;
        let g = 'A';
        if (score < 2) g = 'D';
        else if (score < 3) g = 'C';
        else if (score < 3.8) g = 'B';
        newObj.grade = g;
        return newObj;
      }
      return c;
    });
    setContractorEvals(updated);
    triggerToast('Penilaian pembekal telah dikemas kini!');
  };

  // Direct File Downloader Function (JSX & Standalone HTML)
  const handleDownloadCodeFile = (fileType: string) => {
    setShowCodeDownloadMenu(false);
    let filename = '';
    let content = '';
    let mimeType = 'text/plain;charset=utf-8;';

    if (fileType === 'html') {
      filename = 'jkr_dashboard_pentadbiran.html';
      mimeType = 'text/html;charset=utf-8;';
      content = `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JKR Malaysia - Sistem Papan Pemuka Pentadbiran 2026</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen p-4 sm:p-8">
  <div class="max-w-7xl mx-auto space-y-6">
    <div class="flex items-center justify-between border-b border-slate-800 pb-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-amber-400">JABATAN KERJA RAYA MALAYSIA</h1>
        <p class="text-xs sm:text-sm text-slate-400">Sistem Papan Pemuka Eksekutif Pentadbiran & Kewangan (Tahun Kewangan 2026)</p>
      </div>
      <span class="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-xs font-bold">1GFMAS AKTIF</span>
    </div>

    <!-- KPI Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div class="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl">
        <span class="text-xs font-bold text-slate-400 block mb-1">PERUNTUKAN BERSIH</span>
        <span class="text-xl font-bold mono text-cyan-400">RM 4,405,000.00</span>
        <span class="text-[11px] text-slate-500 block mt-2">Waran Asas + Pindaan</span>
      </div>
      <div class="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl">
        <span class="text-xs font-bold text-slate-400 block mb-1">BELANJA & TANGGUNGAN</span>
        <span class="text-xl font-bold mono text-purple-400">RM 3,369,500.00</span>
        <span class="text-[11px] text-slate-500 block mt-2">${projects.length} Kontrak Aktif</span>
      </div>
      <div class="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl">
        <span class="text-xs font-bold text-slate-400 block mb-1">KADAR PENYERAPAN</span>
        <span class="text-xl font-bold mono text-emerald-400">${overallAbsorptionRate}%</span>
        <span class="text-[11px] text-emerald-500 block mt-2">OPTIMUM (≥70%)</span>
      </div>
      <div class="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl">
        <span class="text-xs font-bold text-slate-400 block mb-1">BAKI PERUNTUKAN</span>
        <span class="text-xl font-bold mono text-amber-400">RM ${totalBalanceBudget.toLocaleString()}</span>
        <span class="text-[11px] text-slate-500 block mt-2">Baki Dana Bebas</span>
      </div>
      <div class="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl">
        <span class="text-xs font-bold text-slate-400 block mb-1">PURATA FIZIKAL</span>
        <span class="text-xl font-bold mono text-rose-400">${avgPhysicalProgress}%</span>
        <span class="text-[11px] text-rose-400 block mt-2">${delayedProjectsCount} Projek Lewat Jadual</span>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 overflow-x-auto">
      <h2 class="text-sm font-bold text-white mb-3">Senarai Projek & Perolehan JKR Pentadbiran 2026</h2>
      <table class="w-full text-left text-xs whitespace-nowrap">
        <thead class="bg-slate-900 text-slate-400 font-bold uppercase text-[10px]">
          <tr>
            <th class="p-3">No. Rujukan</th>
            <th class="p-3">Kategori & Skop Kerja</th>
            <th class="p-3">Kaedah</th>
            <th class="p-3">Kontraktor Dilantik</th>
            <th class="p-3 text-right">Nilai Kontrak (RM)</th>
            <th class="p-3 text-center">Kemajuan</th>
            <th class="p-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700 text-slate-200">
          ${projects.map(p => `
            <tr>
              <td class="p-3 font-mono">${p.ref}</td>
              <td class="p-3">${p.desc}</td>
              <td class="p-3">${p.method}</td>
              <td class="p-3">${p.contractor}</td>
              <td class="p-3 text-right font-mono">RM ${p.value.toLocaleString()}</td>
              <td class="p-3 text-center font-bold ${p.status === 'Selesai' ? 'text-emerald-400' : p.status === 'Lewat Jadual' ? 'text-rose-400' : 'text-cyan-400'}">${p.actualProgress}%</td>
              <td class="p-3 text-center"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status === 'Selesai' ? 'bg-emerald-500/20 text-emerald-300' : p.status === 'Lewat Jadual' ? 'bg-rose-500/20 text-rose-300' : 'bg-blue-500/20 text-blue-300'}">${p.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="text-center text-xs text-slate-500 py-4">
      Jabatan Kerja Raya Malaysia &copy; 2026 | Bahagian Pentadbiran & Kewangan
    </div>
  </div>
</body>
</html>`;
    } else if (fileType === 'txt') {
      filename = 'jkr_dashboard_pentadbiran_ringkasan.txt';
      mimeType = 'text/plain;charset=utf-8;';
      content = `JABATAN KERJA RAYA MALAYSIA - BAHAGIAN PENTADBIRAN & KEWANGAN 2026
Sistem Papan Pemuka Eksekutif Kewangan & Pemantauan Kontrak (SPMP)
==================================================================
Peruntukan Bersih: RM ${totalNetBudget.toLocaleString()}
Belanja & Tanggungan: RM ${totalSpentBudget.toLocaleString()}
Kadar Penyerapan: ${overallAbsorptionRate}%
Baki Dana: RM ${totalBalanceBudget.toLocaleString()}
Bilangan Kontrak: ${projects.length}
Projek Lewat: ${delayedProjectsCount}
Projek Selesai: ${completedProjectsCount}`;
    } else {
      filename = 'jkr_executive_dashboard.tsx';
      mimeType = 'text/typescript;charset=utf-8;';
      content = `// JABATAN KERJA RAYA MALAYSIA - BAHAGIAN PENTADBIRAN & KEWANGAN
// Fail Komponen React / TypeScript (.tsx).
// Rujuk kod sumber utama di App.tsx untuk kegunaan penuh.`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast(`Fail "${filename}" dimuat turun!`);
  };

  // Export Projects to Real CSV
  const handleExportCSV = () => {
    let csv = "No Rujukan,Kategori,Keterangan,Kaedah,Kontraktor,Nilai (RM),Tarikh Mula,Tarikh Siap,Kemajuan Sasaran (%),Kemajuan Sebenar (%),Status,Pegawai Bertanggungjawab\n";
    projects.forEach(p => {
      csv += `"${p.ref}","${p.cat}","${p.desc}","${p.method}","${p.contractor}",${p.value},"${p.start}","${p.end}",${p.targetProgress},${p.actualProgress},"${p.status}","${p.pic}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Kontrak_JKR_Pentadbiran_2026_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Laporan CSV berjaya dimuat turun ke komputer anda.');
  };

  const formatRM = (val: number) => {
    return 'RM ' + Number(val).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* --- TOP MALAYSIAN GOVERNMENT TICKER --- */}
      <div className="bg-[#081729] text-slate-300 border-b border-[#d4af37]/25 text-[11px] py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            PELAYAN 1GFMAS AKTIF
          </span>
          <span className="hidden md:inline font-mono text-slate-400">
            PTJ: 270401 | JABATAN KERJA RAYA MALAYSIA
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[#d4af37] tracking-wide">{currentTime || "ISNIN, 2 NOV 2026"}</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden sm:inline">Tahun Kewangan: <strong className="text-white font-mono">2026</strong></span>
        </div>
      </div>

      {/* --- EXECUTIVE APP HEADER --- */}
      <header className="bg-[#0b2545] text-white shadow-xl border-b-4 border-[#d4af37] sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Jabatan Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-lg flex-shrink-0">
              <div className="w-full h-full bg-[#0b2545] rounded-[10px] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#d4af37]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight leading-tight text-white">
                  JABATAN KERJA RAYA MALAYSIA
                </h1>
                <span className="bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 text-[10px] font-bold px-1.5 py-0.2 rounded">
                  PENTADBIRAN
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Sistem Papan Pemuka Eksekutif Kewangan & Pemantauan Kontrak (SPMP)
              </p>
            </div>
          </div>

          {/* Quick Action Hub & Officer Profile */}
          <div className="flex items-center gap-2.5 flex-wrap self-end md:self-auto">
            {/* Warning Alert Notification Pill */}
            <button
              onClick={() => setActiveTab('risk')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                delayedProjectsCount > 0 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30' 
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{delayedProjectsCount} Projek Lewat</span>
              {delayedProjectsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              )}
            </button>

            {/* Quick Add Contract Button */}
            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d4af37] hover:bg-[#b89628] text-slate-950 font-bold rounded-lg text-xs transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Daftar Kontrak</span>
            </button>

            {/* DIRECT CODE DOWNLOAD BUTTON & DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setShowCodeDownloadMenu(!showCodeDownloadMenu)}
                title="Muat Turun Kod Sumber Aplikasi"
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs transition shadow-sm border border-cyan-400/50"
              >
                <Code2 className="w-4 h-4" />
                <span className="hidden sm:inline">Muat Turun Kod</span>
              </button>

              {showCodeDownloadMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border-2 border-cyan-400/60 rounded-xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-3 py-1 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                    Pilih Format (Disyorkan: .HTML)
                  </div>
                  <button
                    onClick={() => handleDownloadCodeFile('html')}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-white group"
                  >
                    <div>
                      <span className="font-bold block text-emerald-400 group-hover:underline">Fail Web Mandiri (.html)</span>
                      <span className="text-[10px] text-slate-400">Buka terus di Chrome / Edge (Tiada ralat)</span>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded font-bold">Terus Buka</span>
                  </button>
                  <button
                    onClick={() => handleDownloadCodeFile('txt')}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-white"
                  >
                    <div>
                      <span>Salinan Teks (.txt)</span>
                      <span className="text-[10px] text-slate-400 block">Boleh buka di Notepad / sebarang peranti</span>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">TXT</span>
                  </button>
                  <button
                    onClick={() => handleDownloadCodeFile('tsx')}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-white"
                  >
                    <div>
                      <span>Kod React (.tsx)</span>
                      <span className="text-[10px] text-slate-400 block">Untuk pembangun web / VS Code</span>
                    </div>
                    <span className="text-[10px] font-mono bg-cyan-900/60 text-cyan-300 px-1.5 py-0.5 rounded">React</span>
                  </button>
                  <div className="border-t border-slate-800 mt-1 pt-1">
                    <button
                      onClick={handleExportCSV}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-800 flex items-center justify-between text-slate-200 hover:text-white"
                    >
                      <div>
                        <span>Data Projek (.csv)</span>
                        <span className="text-[10px] text-slate-400 block">Buka dalam Microsoft Excel</span>
                      </div>
                      <span className="text-[10px] font-mono bg-amber-900/60 text-amber-300 px-1.5 py-0.5 rounded">Excel</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* CSV Quick Export */}
            <button
              onClick={handleExportCSV}
              title="Eksport Pangkalan Data ke CSV"
              className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition"
            >
              <Download className="w-4 h-4 text-[#d4af37]" />
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[#d4af37] transition"
              title="Tukar Mod Gelap / Terang"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Officer Profile Badge */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-700 text-left">
              <div className="w-7 h-7 rounded-full bg-[#d4af37] text-slate-950 font-extrabold text-xs flex items-center justify-center">
                JD
              </div>
              <div>
                <p className="text-[11px] font-bold leading-none text-white">Ir. Mohd Nizam</p>
                <p className="text-[9px] text-[#d4af37] leading-none mt-0.5">Jurutera Daerah / P.O Kanan</p>
              </div>
            </div>
          </div>

        </div>

        {/* NAVIGATION TAB BAR */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-700/60 flex space-x-1 sm:space-x-3 overflow-x-auto py-2 text-xs font-medium scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-[#d4af37]/20 text-[#d4af37] font-bold border border-[#d4af37]/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PieIcon className="w-4 h-4" />
            Ringkasan Eksekutif & KPI
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'projects'
                ? 'bg-[#d4af37]/20 text-[#d4af37] font-bold border border-[#d4af37]/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Senarai Kontrak & Projek ({projects.length})
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'budget'
                ? 'bg-[#d4af37]/20 text-[#d4af37] font-bold border border-[#d4af37]/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Analisis Bajet Mengurus (OA) & Virement
          </button>

          <button
            onClick={() => setActiveTab('risk')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition whitespace-nowrap relative ${
              activeTab === 'risk'
                ? 'bg-[#d4af37]/20 text-[#d4af37] font-bold border border-[#d4af37]/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Amaran Awal & Surat S.O
            {delayedProjectsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[9px] font-extrabold">
                {delayedProjectsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('scorecard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'scorecard'
                ? 'bg-[#d4af37]/20 text-[#d4af37] font-bold border border-[#d4af37]/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            e-Penilaian Pembekal
          </button>
        </div>
      </header>

      {/* --- MAIN INTERACTIVE CONTAINER --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ========================================================================= */}
        {/* TAB 1: EXECUTIVE KPI DASHBOARD                                            */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Quarter Filter Pill Selector & Live Reset */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0b2545] text-[#d4af37] flex items-center justify-center font-bold">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Prestasi Komprehensif Suku Tahun 2026
                  </h2>
                  <p className="text-xs text-slate-500">
                    Klik mana-mana kad KPI atau sektor carta untuk analisis terperinci secara langsung.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                <span className="text-slate-400 text-[11px] px-2">Suku:</span>
                {(['ALL', 'Q1', 'Q2', 'Q3', 'Q4'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setQuarterFilter(q);
                      triggerToast(`Paparan diselaraskan bagi ${q === 'ALL' ? 'Semua Suku Tahun' : q}`);
                    }}
                    className={`px-3 py-1 rounded-lg transition ${
                      quarterFilter === q
                        ? 'bg-[#0b2545] text-[#d4af37] shadow font-bold scale-105'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {q === 'ALL' ? 'Keseluruhan' : q}
                  </button>
                ))}
              </div>
            </div>

            {/* 5 Core Metric Cards with Click-to-Drilldown Functionality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Metric 1: Net Allocation -> Click opens Budget Tab */}
              <div
                onClick={() => setActiveTab('budget')}
                className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-cyan-400 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                title="Klik untuk membuka modul Bajet & Virement"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  <span>PERUNTUKAN BERSIH</span>
                  <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 group-hover:scale-110 transition">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white group-hover:text-cyan-500 transition">
                  {formatRM(totalNetBudget)}
                </div>
                <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
                  <span>Waran Asas + Pindaan</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-0.5">
                    Perincian <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Metric 2: Committed / Spent -> Click opens Budget Tab */}
              <div
                onClick={() => setActiveTab('budget')}
                className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                title="Klik untuk menganalisis perbelanjaan mengikut kod Vot"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  <span>BELANJA & TANGGUNGAN</span>
                  <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 group-hover:scale-110 transition">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {formatRM(totalSpentBudget)}
                </div>
                <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
                  <span>1GFMAS Disahkan</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-0.5">
                    {budgets.length} Vot OA <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Metric 3: Absorption Rate */}
              <div
                onClick={() => setActiveTab('budget')}
                className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                title="Klik untuk menganalisis kadar penyerapan"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  <span>KADAR PENYERAPAN</span>
                  <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 group-hover:scale-110 transition">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {overallAbsorptionRate}%
                </div>
                <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                    OPTIMUM (&ge;70%)
                  </span>
                  <span className="text-emerald-600 font-bold flex items-center gap-0.5 text-[10px]">
                    Kalkulator &rarr;
                  </span>
                </div>
              </div>

              {/* Metric 4: Balance Funds */}
              <div
                onClick={() => setActiveTab('budget')}
                className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-amber-400 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                title="Klik untuk semak baki peruntukan bebas"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  <span>BAKI PERUNTUKAN</span>
                  <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 group-hover:scale-110 transition">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
                  {formatRM(totalBalanceBudget)}
                </div>
                <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
                  <span>Baki: <strong>{((totalBalanceBudget / totalNetBudget) * 100).toFixed(1)}%</strong></span>
                  <span className="text-amber-600 font-bold text-[10px]">Agih &rarr;</span>
                </div>
              </div>

              {/* Metric 5: Average Physical Progress -> Click filters delayed projects */}
              <div
                onClick={() => handleDrilldownStatus(delayedProjectsCount > 0 ? 'Lewat Jadual' : 'ALL')}
                className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-rose-400 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                title="Klik untuk menapis projek bermasalah"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  <span>PURATA FIZIKAL PROJEK</span>
                  <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 group-hover:scale-110 transition">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {avgPhysicalProgress}%
                </div>
                <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
                  <span className="text-emerald-500 font-semibold">{completedProjectsCount} Siap</span>
                  <span className="text-rose-500 font-bold bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded text-[10px]">
                    {delayedProjectsCount} Lewat (Tapis)
                  </span>
                </div>
              </div>

            </div>

            {/* Visualisations Grid: 3 Rich Interactive Charts with direct click events */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Chart 1: Donut Project Status with Click Interaction */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Status Projek Pentadbiran</h3>
                    <span className="text-xs font-mono text-slate-400">{projects.length} Kontrak</span>
                  </div>
                  <p className="text-xs text-slate-500">Klik mana-mana warna untuk menapis senarai kontrak serta-merta</p>
                </div>

                <div className="h-56 w-full flex items-center justify-center my-2 cursor-pointer">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        onClick={(entry: any) => handleDrilldownStatus(entry.name === 'Pelaksanaan' ? 'Dalam Pelaksanaan' : entry.name)}
                      >
                        {statusPieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            className="cursor-pointer transition-transform duration-200 hover:opacity-80"
                          />
                        ))}
                      </Pie>
                      <ReTooltip
                        formatter={(val: any, name: any) => [`${val} Kontrak (Klik untuk tapis)`, name]}
                        contentStyle={{
                          backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                          borderColor: darkMode ? '#334155' : '#cbd5e1',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 text-center text-xs pt-3 border-t border-slate-100 dark:border-slate-800 gap-1">
                  <button
                    onClick={() => handleDrilldownStatus('Selesai')}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <div className="flex items-center justify-center gap-1 text-slate-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span>Selesai</span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5 block">{completedProjectsCount}</span>
                  </button>
                  <button
                    onClick={() => handleDrilldownStatus('Dalam Pelaksanaan')}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <div className="flex items-center justify-center gap-1 text-slate-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                      <span>Sedang</span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5 block">{activeProjectsCount}</span>
                  </button>
                  <button
                    onClick={() => handleDrilldownStatus('Lewat Jadual')}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <div className="flex items-center justify-center gap-1 text-slate-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span>Lewat</span>
                    </div>
                    <span className="font-bold text-rose-600 font-mono mt-0.5 block">{delayedProjectsCount}</span>
                  </button>
                </div>
              </div>

              {/* Chart 2: Nilai Perolehan Mengikut Kaedah with Bar Click Slicing */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Nilai Mengikut Kaedah Perolehan</h3>
                    <span className="text-xs font-mono text-[#d4af37] font-bold">RM '000</span>
                  </div>
                  <p className="text-xs text-slate-500">Klik bar untuk menapis kontrak mengikut kaedah perolehan</p>
                </div>

                <div className="h-56 w-full my-2 cursor-pointer">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={procurementMethodData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      onClick={(state: any) => {
                        if (state && state.activePayload && state.activePayload[0]) {
                          handleDrilldownMethod(state.activePayload[0].payload.name);
                        }
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#f1f5f9'} />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: darkMode ? '#94a3b8' : '#64748b' }} />
                      <YAxis tick={{ fontSize: 10, fill: darkMode ? '#94a3b8' : '#64748b' }} />
                      <ReTooltip
                        formatter={(value: any) => [`RM ${(Number(value || 0) * 1000).toLocaleString()} (Klik untuk tapis)`, 'Jumlah Nilai']}
                        contentStyle={{
                          backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                          borderColor: darkMode ? '#334155' : '#cbd5e1',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="nilai" fill="#0b2545" radius={[6, 6, 0, 0]} className="hover:opacity-80 transition" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
                  <span>*Berdasarkan had nilai tatacara perolehan kerajaan terkini</span>
                  <button onClick={() => setActiveTab('projects')} className="text-[#0b2545] dark:text-[#d4af37] font-bold hover:underline">
                    Perincian &rarr;
                  </button>
                </div>
              </div>

              {/* Chart 3: Tren Perbelanjaan Bulanan Mengurus */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Tren Perbelanjaan Kumulatif</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      +4.2% Melebihi Unjuran
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Perbandingan perbelanjaan sebenar vs sasaran (RM '000)</p>
                </div>

                <div className="h-56 w-full my-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#f1f5f9'} />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: darkMode ? '#94a3b8' : '#64748b' }} />
                      <YAxis tick={{ fontSize: 10, fill: darkMode ? '#94a3b8' : '#64748b' }} />
                      <ReTooltip
                        formatter={(val: any) => val ? [`RM ${(Number(val) * 1000).toLocaleString()}`, 'Kumulatif'] : ['Belum Tiba', '']}
                        contentStyle={{
                          backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                          borderColor: darkMode ? '#334155' : '#cbd5e1',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Line type="monotone" dataKey="sasaran" stroke="#94a3b8" strokeDasharray="4 4" dot={false} strokeWidth={2} name="Sasaran Waran" />
                      <Line type="monotone" dataKey="sebenar" stroke="#d4af37" strokeWidth={3} dot={{ r: 3, fill: '#d4af37' }} name="Sebenar" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-[#d4af37] rounded"></span>
                    <span>Perbelanjaan Sebenar</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-slate-400 border-dashed"></span>
                    <span>Unjuran Asal</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Strategic Summary Table with Clickable Vot Rows */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Status Prestasi Vot Objek Am Utama (B01 Pentadbiran)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kedudukan dana semasa mengurus. Klik mana-mana baris untuk memulakan simulasi pindaan peruntukan.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('budget')}
                  className="text-xs font-semibold text-[#0b2545] dark:text-[#d4af37] hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  Buka Modul Bajet Penuh & Virement &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-2.5 px-3 rounded-l-lg">Kod OA</th>
                      <th className="py-2.5 px-3">Keterangan</th>
                      <th className="py-2.5 px-3 text-right">Peruntukan Bersih</th>
                      <th className="py-2.5 px-3 text-right">Belanja & Komitmen</th>
                      <th className="py-2.5 px-3 text-right">Baki Dana</th>
                      <th className="py-2.5 px-3 w-40">Penyerapan (%)</th>
                      <th className="py-2.5 px-3 text-center rounded-r-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {budgets.slice(0, 5).map((b) => {
                      const rate = ((b.spent / b.net) * 100);
                      return (
                        <tr
                          key={b.code}
                          onClick={() => {
                            setVirementFrom(b.code);
                            setActiveTab('budget');
                            triggerToast(`Vot ${b.code} dipilih sebagai sumber simulasi Virement!`);
                          }}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer group"
                          title="Klik untuk memilih kod ini dalam modul kalkulator bajet"
                        >
                          <td className="py-2.5 px-3 font-mono font-bold text-[#0b2545] dark:text-[#d4af37] group-hover:underline">
                            {b.code}
                          </td>
                          <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">{b.desc}</td>
                          <td className="py-2.5 px-3 text-right font-mono">{formatRM(b.net)}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">{formatRM(b.spent)}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-amber-600 dark:text-amber-400">{formatRM(b.net - b.spent)}</td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${rate > 80 ? 'bg-amber-500' : rate >= 60 ? 'bg-emerald-500' : 'bg-purple-500'}`}
                                  style={{ width: `${Math.min(rate, 100)}%` }}
                                ></div>
                              </div>
                              <span className="font-mono text-[11px] font-semibold w-9 text-right">{rate.toFixed(1)}%</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              b.status === 'Tinggi' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                              b.status === 'Optimum' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                              'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PROJECTS & PROCUREMENT MANAGEMENT                                  */}
        {/* ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="space-y-5 animate-fadeIn">
            
            {/* Filter & Live Search Toolbar with Active Filter Indicators */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              <div className="flex flex-wrap items-center gap-2.5 flex-1">
                {/* Search Box */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari kontraktor, no. ruj, projek..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Status Dropdown */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="Selesai">Selesai ({completedProjectsCount})</option>
                  <option value="Dalam Pelaksanaan">Dalam Pelaksanaan ({activeProjectsCount})</option>
                  <option value="Lewat Jadual">Lewat Jadual ({delayedProjectsCount})</option>
                </select>

                {/* Method Dropdown */}
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                >
                  <option value="ALL">Semua Kaedah Perolehan</option>
                  <option value="Tender Terbuka">Tender Terbuka</option>
                  <option value="Sebut Harga">Sebut Harga</option>
                  <option value="Lantikan Terus">Lantikan Terus</option>
                </select>

                {/* Clear All Filters button if any active */}
                {(statusFilter !== 'ALL' || methodFilter !== 'ALL' || searchQuery !== '') && (
                  <button
                    onClick={() => {
                      setStatusFilter('ALL');
                      setMethodFilter('ALL');
                      setSearchQuery('');
                      triggerToast('Semua tapisan telah dikosongkan.');
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-semibold hover:bg-rose-100 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reset Tapis
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs rounded-xl font-medium transition"
                  title="Tukar susunan turutan"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                  <span>{sortOrder === 'asc' ? 'Menaik (A-Z)' : 'Menurun (Z-A)'}</span>
                </button>

                <button
                  onClick={() => setIsNewProjectModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0b2545] hover:bg-[#134074] text-white rounded-xl text-xs font-semibold transition border border-[#d4af37]/30 shadow-sm"
                >
                  <Plus className="w-4 h-4 text-[#d4af37]" />
                  <span>Daftar Kontrak</span>
                </button>
              </div>

            </div>

            {/* Main Interactive Project Register Table with Inline +5% / -5% Buttons */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4">No. Rujukan</th>
                      <th className="py-3 px-4">Kategori & Keterangan</th>
                      <th className="py-3 px-4">Kaedah</th>
                      <th className="py-3 px-4">Kontraktor Dilantik</th>
                      <th className="py-3 px-4 text-right cursor-pointer" onClick={() => setSortBy('value')}>
                        <div className="flex items-center justify-end gap-1">
                          <span>Nilai (RM)</span>
                          {sortBy === 'value' && <ArrowUpDown className="w-3 h-3 text-[#d4af37]" />}
                        </div>
                      </th>
                      <th className="py-3 px-4 cursor-pointer" onClick={() => setSortBy('actualProgress')}>
                        <div className="flex items-center gap-1">
                          <span>Kemajuan Fizikal (Pantas &plusmn;5%)</span>
                          {sortBy === 'actualProgress' && <ArrowUpDown className="w-3 h-3 text-[#d4af37]" />}
                        </div>
                      </th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Tindakan Interaktif</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredProjects.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                          Tiada rekod kontrak sepadan dengan kriteria carian anda.
                        </td>
                      </tr>
                    ) : (
                      filteredProjects.map((proj) => {
                        let barBg = 'bg-blue-600';
                        if (proj.status === 'Selesai') barBg = 'bg-emerald-500';
                        if (proj.status === 'Lewat Jadual') barBg = 'bg-rose-500';

                        return (
                          <tr key={proj.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                            <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                              {proj.ref}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900 dark:text-white">{proj.cat}</div>
                              <div className="text-[11px] text-slate-500 max-w-xs truncate" title={proj.desc}>
                                {proj.desc}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleDrilldownMethod(proj.method)}
                                className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
                                title="Klik untuk tapis kaedah ini"
                              >
                                {proj.method}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">
                              {proj.contractor}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                              {formatRM(proj.value)}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {/* Quick Decrement Button */}
                                <button
                                  onClick={() => handleQuickProgressStep(proj.id, -5)}
                                  className="w-5 h-5 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
                                  title="Kurangkan -5%"
                                >
                                  -
                                </button>

                                <div className="w-20 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                  <div
                                    className={`${barBg} h-full rounded-full transition-all duration-300`}
                                    style={{ width: `${proj.actualProgress}%` }}
                                  ></div>
                                </div>
                                <span className="font-mono text-xs font-semibold w-9 text-right">{proj.actualProgress}%</span>
                                
                                {/* Quick Increment Button */}
                                <button
                                  onClick={() => handleQuickProgressStep(proj.id, 5)}
                                  className="w-5 h-5 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
                                  title="Tambah +5%"
                                >
                                  +
                                </button>

                                <span className="text-[10px] text-slate-400">({proj.targetProgress}%)</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleDrilldownStatus(proj.status)}
                                title="Klik untuk tapis status ini"
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition hover:scale-105 ${
                                  proj.status === 'Selesai'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                    : proj.status === 'Dalam Pelaksanaan'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  proj.status === 'Selesai' ? 'bg-emerald-500' : proj.status === 'Dalam Pelaksanaan' ? 'bg-blue-500' : 'bg-rose-500 animate-pulse'
                                }`}></span>
                                {proj.status}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => setSelectedProject(proj)}
                                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-slate-700 dark:text-slate-200 transition"
                                  title="Lihat Perincian Kontrak"
                                >
                                  Perincian
                                </button>
                                <button
                                  onClick={() => handleOpenUpdateModal(proj)}
                                  className="px-2.5 py-1 text-[11px] rounded-lg bg-[#0b2545] hover:bg-[#134074] text-[#d4af37] font-semibold transition"
                                  title="Laraskan Kemajuan Gelongsor"
                                >
                                  Laraskan
                                </button>
                                {proj.status === 'Lewat Jadual' && (
                                  <button
                                    onClick={() => handleGenerateWarningLetter(proj)}
                                    className="p-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition"
                                    title="Keluarkan Surat Peringatan S.O"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Summary Footer */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Menunjukkan {filteredProjects.length} daripada {projects.length} rekod perolehan JKR</span>
                <div className="flex items-center gap-2">
                  <button onClick={handleExportCSV} className="text-xs text-[#0b2545] dark:text-[#d4af37] font-bold hover:underline flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    Muat Turun Jadual CSV
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BUDGET ANALYSIS & VIREMENT SIMULATOR                               */}
        {/* ========================================================================= */}
        {activeTab === 'budget' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Interactive Virement Simulator (Pindaan Peruntukan / Agihan Semula Dana) */}
            <div className="bg-gradient-to-r from-[#0b2545] via-[#103056] to-[#0b2545] text-white p-5 rounded-2xl shadow-lg border-2 border-[#d4af37]/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
                    <Sliders className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">
                      Kalkulator & Simulator Pindaan Peruntukan (Virement Antara Vot)
                    </h3>
                    <p className="text-xs text-slate-300">
                      Simulasikan agihan semula dana mengikut Pekeliling Perbendaharaan Malaysia (1GFMAS) dan saksikan kesan serta-merta kepada kadar penyerapan bajet.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-mono">Baki Bersih Semasa</span>
                  <span className="text-lg font-bold font-mono text-[#d4af37]">{formatRM(totalBalanceBudget)}</span>
                </div>
              </div>

              {/* Dynamic Interactive Virement Preset & Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    1. Vot Sumber (Pemberi)
                  </label>
                  <select
                    value={virementFrom}
                    onChange={(e) => setVirementFrom(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  >
                    {budgets.map(b => (
                      <option key={b.code} value={b.code}>
                        {b.code} - {b.desc.slice(0, 24)}... (Baki: {formatRM(b.net - b.spent)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    2. Vot Penerima (Sasaran)
                  </label>
                  <select
                    value={virementTo}
                    onChange={(e) => setVirementTo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  >
                    {budgets.map(b => (
                      <option key={b.code} value={b.code}>
                        {b.code} - {b.desc.slice(0, 24)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      3. Amaun Pindaan (RM)
                    </label>
                    <div className="flex gap-1 text-[10px]">
                      {[10000, 25000, 50000].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setVirementAmount(val)}
                          className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[#d4af37] border border-slate-700"
                        >
                          +{val/1000}k
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="number"
                    step="5000"
                    value={virementAmount}
                    onChange={(e) => setVirementAmount(e.target.value)}
                    placeholder="e.g. 25000"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37] font-mono"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleExecuteVirement}
                    className="w-full py-2 bg-[#d4af37] hover:bg-[#b89628] text-slate-950 font-bold rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Laksana Pindaan Vot</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Complete Objek Am Budget Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Penyata Prestasi Perbelanjaan Mengurus B01 Cawangan Pentadbiran 2026
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mematuhi Kod Piawaian Perakaunan Akruan Kerajaan Persekutuan. Klik 'Pilih Virement' untuk memuatkan kod terus ke simulator.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setBudgets(INITIAL_BUDGET);
                      triggerToast('Data peruntukan telah ditetapkan semula kepada asal.');
                    }}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                  >
                    Reset Vot Asal
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Kod Vot</th>
                      <th className="py-3 px-4">Keterangan Perbelanjaan</th>
                      <th className="py-3 px-4 text-right">Peruntukan Asal</th>
                      <th className="py-3 px-4 text-right">Pindaan / Virement</th>
                      <th className="py-3 px-4 text-right">Peruntukan Bersih</th>
                      <th className="py-3 px-4 text-right">Belanja Sebenar</th>
                      <th className="py-3 px-4 text-right">Baki Dana</th>
                      <th className="py-3 px-4 w-44">Kadar Penyerapan (%)</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {budgets.map((b) => {
                      const rate = ((b.spent / b.net) * 100);
                      const balance = b.net - b.spent;

                      let barColor = 'bg-blue-600';
                      if (rate > 80) barColor = 'bg-amber-500';
                      else if (rate >= 60) barColor = 'bg-emerald-500';
                      else barColor = 'bg-purple-500';

                      return (
                        <tr
                          key={b.code}
                          onClick={() => {
                            setVirementFrom(b.code);
                            triggerToast(`Kod ${b.code} dimuatkan sebagai Vot Sumber (Pemberi)!`);
                          }}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer group"
                          title="Klik untuk memilih kod ini sebagai Vot Sumber"
                        >
                          <td className="py-3 px-4 font-mono font-bold text-[#0b2545] dark:text-[#d4af37] group-hover:underline">
                            {b.code}
                          </td>
                          <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">{b.desc}</td>
                          <td className="py-3 px-4 text-right font-mono text-slate-500">{formatRM(b.original)}</td>
                          <td className="py-3 px-4 text-right font-mono font-semibold">
                            {b.revised > 0 ? (
                              <span className="text-emerald-600 dark:text-emerald-400">+{formatRM(b.revised)}</span>
                            ) : b.revised < 0 ? (
                              <span className="text-rose-600 dark:text-rose-400">{formatRM(b.revised)}</span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">{formatRM(b.net)}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">{formatRM(b.spent)}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-800 dark:text-slate-200">{formatRM(balance)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                <div className={`${barColor} h-full rounded-full`} style={{ width: `${Math.min(rate, 100)}%` }}></div>
                              </div>
                              <span className="font-mono text-xs font-semibold w-11 text-right">{rate.toFixed(1)}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              b.status === 'Tinggi' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                              b.status === 'Optimum' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                              'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-50 dark:bg-slate-800/90 font-bold text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-slate-700">
                    <tr>
                      <td colSpan={2} className="py-3.5 px-4 uppercase text-xs">JUMLAH KESELURUHAN (B01 PENTADBIRAN)</td>
                      <td className="py-3.5 px-4 text-right font-mono">{formatRM(budgets.reduce((a, b) => a + b.original, 0))}</td>
                      <td className="py-3.5 px-4 text-right font-mono text-emerald-600">
                        {budgets.reduce((a, b) => a + b.revised, 0) >= 0 ? '+' : ''}
                        {formatRM(budgets.reduce((a, b) => a + b.revised, 0))}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-blue-600 dark:text-blue-400">{formatRM(totalNetBudget)}</td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-900 dark:text-white">{formatRM(totalSpentBudget)}</td>
                      <td className="py-3.5 px-4 text-right font-mono text-amber-600">{formatRM(totalBalanceBudget)}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-[#d4af37] h-full rounded-full" style={{ width: `${overallAbsorptionRate}%` }}></div>
                          </div>
                          <span className="font-mono text-xs font-bold">{overallAbsorptionRate}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          OPTIMUM
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: RISK & EARLY WARNING SYSTEM                                       */}
        {/* ========================================================================= */}
        {activeTab === 'risk' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Warning Header */}
            <div className="bg-rose-50 dark:bg-rose-950/40 border-l-4 border-rose-600 p-5 rounded-r-2xl shadow-sm flex items-start gap-4">
              <div className="p-3 bg-rose-100 dark:bg-rose-900/60 rounded-xl text-rose-600 dark:text-rose-400 flex-shrink-0">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-rose-900 dark:text-rose-200">
                  Sistem Amaran Awal Projek Bermasalah (Early Warning Alert Matrix)
                </h3>
                <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-300 mt-1 leading-relaxed">
                  Berdasarkan pemantauan tapak sehingga 2 November 2026, <strong>{delayedProjectsCount} kontrak</strong> dikesan mengalami jurang kelewatan fizikal melebihi <span className="font-bold underline decoration-rose-500">-15% daripada garis dasar CPM</span>. Pegawai Penguasa (S.O) disarankan mengeluarkan Notis Ketidakpatuhan atau Surat Peringatan rasmi di bawah Syarat-syarat Kontrak JKR.
                </p>
              </div>
            </div>

            {/* List of Delayed Projects Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.filter(p => p.status === 'Lewat Jadual').map(p => {
                const variance = p.targetProgress - p.actualProgress;
                return (
                  <div
                    key={p.id}
                    className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-6 shadow-xl shadow-rose-500/5 border-2 border-rose-400/40 dark:border-rose-900/60 flex flex-col justify-between backdrop-blur-md"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-rose-500 to-red-600 text-white uppercase tracking-wider shadow-md shadow-rose-500/20">
                          LEWAT JADUAL KRITIKAL
                        </span>
                        <span className="font-mono text-xs text-rose-500 font-bold">{p.ref}</span>
                      </div>

                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
                        {p.desc}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                        Kontraktor: <strong className="text-slate-800 dark:text-slate-200">{p.contractor}</strong>
                      </p>

                      <div className="space-y-3 mb-5">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Kemajuan Fizikal Sebenar:</span>
                            <span className="font-black font-mono text-rose-600 dark:text-rose-400">{p.actualProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full" style={{ width: `${p.actualProgress}%` }}></div>
                          </div>
                          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                            <span>Jadual Sasaran: <strong className="text-slate-700 dark:text-slate-200 font-mono">{p.targetProgress}%</strong></span>
                            <span className="text-rose-500 font-black font-mono">Varians: -{variance}%</span>
                          </div>
                        </div>

                        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-2 border border-slate-200 dark:border-slate-700">
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400">Nilai Kontrak:</span>
                            <span className="font-mono font-bold text-slate-900 dark:text-white">{formatRM(p.value)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400">Tarikh Tamat Kontrak:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{p.end}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400">Pegawai Penguasa (S.O):</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{p.pic}</span>
                          </div>
                          <div className="pt-1.5 text-[11px] text-rose-600 dark:text-rose-400 border-t border-slate-200 dark:border-slate-700/60">
                            <strong>Catatan Tapak:</strong> {p.notes}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      <button
                        onClick={() => handleGenerateWarningLetter(p)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20 active:scale-95"
                      >
                        <FileText className="w-4 h-4 stroke-[2.5]" />
                        <span>Keluarkan Surat Amaran S.O</span>
                      </button>
                      <button
                        onClick={() => handleOpenUpdateModal(p)}
                        className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition border border-slate-200 dark:border-slate-700"
                        title="Laraskan kemajuan tapak"
                      >
                        Kemaskini %
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Standard Operating Procedure (SOP) Guidance Box */}
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl p-5 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 backdrop-blur-md">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                Tatacara Tindakan Pemulihan Kontrak (SOP JKR Malaysia)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-gradient-to-br from-blue-500/10 to-transparent dark:from-blue-950/40 rounded-xl border border-blue-400/40">
                  <span className="font-extrabold text-blue-600 dark:text-blue-400 block mb-1">Tahap 1: Surat Peringatan (Varians &gt; 10%)</span>
                  <p className="text-slate-600 dark:text-slate-300">Mengarahkan kontraktor mengemukakan Catch-up Plan serta penambahan logistik dalam tempoh 7 hari.</p>
                </div>
                <div className="p-3.5 bg-gradient-to-br from-amber-500/10 to-transparent dark:from-amber-950/40 rounded-xl border border-amber-400/40">
                  <span className="font-extrabold text-amber-600 dark:text-amber-400 block mb-1">Tahap 2: Notis Niat Tamat Kontrak (Varians &gt; 25%)</span>
                  <p className="text-slate-600 dark:text-slate-300">Klaus 43 Syarat Kontrak Standard JKR dimulakan sekiranya tiada kemajuan pemulihan ditunjukkan.</p>
                </div>
                <div className="p-3.5 bg-gradient-to-br from-rose-500/10 to-transparent dark:from-rose-950/40 rounded-xl border border-rose-400/40">
                  <span className="font-extrabold text-rose-600 dark:text-rose-400 block mb-1">Tahap 3: Penamatan Kontrak & Tuntutan Bon</span>
                  <p className="text-slate-600 dark:text-slate-300">Rampasan Jaminan Bank / Bon Pelaksanaan dan kontraktor disyorkan senarai hitam (Blacklist CIDB).</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: CONTRACTOR PERFORMANCE SCORECARD                                   */}
        {/* ========================================================================= */}
        {activeTab === 'scorecard' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl p-5 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 backdrop-blur-md">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400 stroke-[2.5]" />
                  Sistem e-Penilaian Prestasi Pembekal & Kontraktor Pentadbiran JKR
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Penilaian berkala berdasarkan 4 indikator utama: Kualiti Kerja, Ketepatan Masa, Pematuhan Keselamatan, dan Pengurusan Tapak.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gradient-to-r from-amber-400/20 to-yellow-500/20 text-amber-500 dark:text-amber-300 px-3.5 py-1.5 rounded-full font-black border border-amber-400/40 shadow-sm">
                  Skala Penilaian: 1 (Lemah) - 5 (Cemerlang)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {contractorEvals.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/80 dark:bg-slate-900/80 rounded-2xl p-5 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all backdrop-blur-md"
                >
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{item.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.project}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`w-9 h-9 rounded-2xl font-black flex items-center justify-center text-sm shadow-lg ${
                        item.grade === 'A' ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 shadow-emerald-500/20' :
                        item.grade === 'B' ? 'bg-gradient-to-br from-blue-400 to-cyan-500 text-slate-950 shadow-cyan-500/20' :
                        item.grade === 'C' ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-amber-500/20' :
                        'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-rose-500/20'
                      }`}>
                        {item.grade}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 font-mono font-bold">GRED KESELURUHAN</span>
                    </div>
                  </div>

                  {/* Interactive Star Rating Controls */}
                  <div className="py-4 space-y-3 text-xs">
                    
                    {/* Quality */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300 font-bold">1. Mutu & Kualiti Kerja:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleUpdateRating(item.id, 'quality', s)}
                            className="p-1 hover:scale-125 transition active:scale-95"
                          >
                            <Star className={`w-4 h-4 ${s <= item.quality ? 'text-amber-400 fill-amber-400 drop-shadow' : 'text-slate-300 dark:text-slate-700'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Timing */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300 font-bold">2. Ketepatan Masa:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleUpdateRating(item.id, 'timing', s)}
                            className="p-1 hover:scale-125 transition active:scale-95"
                          >
                            <Star className={`w-4 h-4 ${s <= item.timing ? 'text-amber-400 fill-amber-400 drop-shadow' : 'text-slate-300 dark:text-slate-700'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Safety */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300 font-bold">3. Pematuhan Keselamatan (OSHA):</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleUpdateRating(item.id, 'safety', s)}
                            className="p-1 hover:scale-125 transition active:scale-95"
                          >
                            <Star className={`w-4 h-4 ${s <= item.safety ? 'text-amber-400 fill-amber-400 drop-shadow' : 'text-slate-300 dark:text-slate-700'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Management */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300 font-bold">4. Kerjasama & Pengurusan Tapak:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleUpdateRating(item.id, 'management', s)}
                            className="p-1 hover:scale-125 transition active:scale-95"
                          >
                            <Star className={`w-4 h-4 ${s <= item.management ? 'text-amber-400 fill-amber-400 drop-shadow' : 'text-slate-300 dark:text-slate-700'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                    <strong>Ulasan Penilai S.O:</strong> "{item.review}"
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: VIEW CONTRACT FULL DETAILS                                      */}
      {/* ========================================================================= */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-cyan-400/40 max-w-lg w-full p-6 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-cyan-500/20">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Maklumat Terperinci Kontrak</h3>
                  <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">{selectedProject.ref}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5">
              <div>
                <span className="text-slate-400 font-medium block">Tajuk Projek:</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{selectedProject.desc}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80">
                <div>
                  <span className="text-slate-400">Kontraktor Dilantik:</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{selectedProject.contractor}</p>
                </div>
                <div>
                  <span className="text-slate-400">Kaedah Perolehan:</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{selectedProject.method}</p>
                </div>
                <div>
                  <span className="text-slate-400">Nilai Kontrak:</span>
                  <p className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">{formatRM(selectedProject.value)}</p>
                </div>
                <div>
                  <span className="text-slate-400">Lokasi Tapak:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedProject.location}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-medium block mb-1">Garis Masa Kontrak:</span>
                <div className="flex justify-between font-mono bg-slate-100 dark:bg-slate-800/80 p-2.5 rounded-xl text-[11px] border border-slate-200 dark:border-slate-700">
                  <span>Tarikh Mula: <strong className="text-slate-800 dark:text-slate-200">{selectedProject.start}</strong></span>
                  <span>Tarikh Siap: <strong className="text-slate-800 dark:text-slate-200">{selectedProject.end}</strong></span>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-400">Kemajuan Fizikal:</span>
                  <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                    Sebenar: {selectedProject.actualProgress}% | Sasaran: {selectedProject.targetProgress}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${selectedProject.status === 'Selesai' ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : selectedProject.status === 'Lewat Jadual' ? 'bg-gradient-to-r from-rose-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`}
                    style={{ width: `${selectedProject.actualProgress}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-900 dark:text-amber-200 border border-amber-400/40">
                <strong>Catatan Pegawai Penguasa (S.O):</strong>
                <p className="mt-0.5">{selectedProject.notes}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: INTERACTIVE PROGRESS SLIDER UPDATE                               */}
      {/* ========================================================================= */}
      {isUpdateModalOpen && projectToUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-cyan-400/40 max-w-md w-full p-6 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-500" />
                Kemaskini Kemajuan Fizikal Tapak
              </h3>
              <button onClick={() => setIsUpdateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <span className="text-slate-400">No Rujukan:</span>
                <p className="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-sm">{projectToUpdate.ref}</p>
                <p className="text-slate-700 dark:text-slate-300 font-semibold mt-1">{projectToUpdate.desc}</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-slate-50 to-sky-50 dark:from-slate-800/70 dark:to-slate-800/30 rounded-2xl space-y-3 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 dark:text-slate-200">Peratusan Fizikal Sebenar:</label>
                  <span className="font-mono text-lg font-black text-cyan-600 dark:text-cyan-400">
                    {updateProgressVal}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={updateProgressVal}
                  onChange={(e) => setUpdateProgressVal(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0% (Mula)</span>
                  <span>Sasaran Semasa: {projectToUpdate.targetProgress}%</span>
                  <span>100% (Siap)</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                *Status projek akan dilaraskan secara automatik berdasarkan jurang dengan jadual perancangan asal CPM.
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveProgress}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-md shadow-cyan-500/20 active:scale-95"
              >
                Simpan Kemajuan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD NEW CONTRACT REGISTRATION                                    */}
      {/* ========================================================================= */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-amber-400/40 max-w-lg w-full p-6 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-500 stroke-[3]" />
                Daftar Kontrak Pentadbiran JKR Baharu
              </h3>
              <button onClick={() => setIsNewProjectModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="py-4 space-y-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Tajuk / Keterangan Projek *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Perkhidmatan Servis Berjadual Chiller Blok B"
                  value={newProjectForm.desc}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, desc: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Kategori Perolehan</label>
                  <select
                    value={newProjectForm.cat}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, cat: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white font-medium"
                  >
                    <option value="Penyelenggaraan Lif">Penyelenggaraan Lif</option>
                    <option value="Pembersihan Bangunan">Pembersihan Bangunan</option>
                    <option value="Kawalan Keselamatan">Kawalan Keselamatan</option>
                    <option value="Sistem Pendingin Hawa">Sistem Pendingin Hawa</option>
                    <option value="Peralatan ICT">Peralatan ICT</option>
                    <option value="Pembaikan Bangunan">Pembaikan Bangunan</option>
                    <option value="Pencegah Kebakaran">Pencegah Kebakaran</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Kaedah Perolehan</label>
                  <select
                    value={newProjectForm.method}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, method: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white font-medium"
                  >
                    <option value="Sebut Harga">Sebut Harga</option>
                    <option value="Tender Terbuka">Tender Terbuka</option>
                    <option value="Lantikan Terus">Lantikan Terus</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Nama Kontraktor Dilantik *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Syarikat / Enterprise"
                    value={newProjectForm.contractor}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, contractor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Nilai Kontrak (RM) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 125000"
                    value={newProjectForm.value}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, value: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Kemajuan Fizikal Awal (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newProjectForm.actualProgress}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, actualProgress: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Pegawai Penguasa (S.O)</label>
                  <input
                    type="text"
                    value={newProjectForm.pic}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, pic: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 rounded-xl font-black shadow-md shadow-amber-500/20 active:scale-95"
                >
                  Daftar Kontrak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: JKR OFFICIAL WARNING LETTER GENERATOR                            */}
      {/* ========================================================================= */}
      {isLetterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-rose-400/40 max-w-2xl w-full p-6 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 no-print">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Templat Surat Peringatan Rasmi Pegawai Penguasa (S.O)
                </h3>
              </div>
              <button onClick={() => setIsLetterModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Letterhead Representation */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl my-4 border border-slate-300 dark:border-slate-800 space-y-4 font-serif text-slate-800 dark:text-slate-200 leading-relaxed print:p-0 print:border-none shadow-inner">
              
              <div className="text-center border-b-2 border-slate-400 pb-3 font-sans">
                <h2 className="font-black text-sm tracking-wider uppercase text-slate-900 dark:text-white">JABATAN KERJA RAYA MALAYSIA</h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Cawangan Pengurusan Pentadbiran & Kewangan, Ibu Pejabat JKR Malaysia</p>
                <p className="text-[9px] text-slate-400">Tel: 03-2691 9011 | Faks: 03-2698 1234 | Laman Web: www.jkr.gov.my</p>
              </div>

              <div className="flex justify-between text-xs font-mono">
                <div>
                  <p>Kepada:</p>
                  <p className="font-bold font-sans text-sm text-slate-900 dark:text-white">{letterData.contractor}</p>
                  <p className="font-sans text-[11px] text-slate-500">Wakil Pengurusan Tapak Kontraktor</p>
                </div>
                <div className="text-right">
                  <p>Ruj. Kami: JKR/ADM/SO/WRN/{letterData.ref.slice(-2)}/2026</p>
                  <p>Tarikh: {letterData.date}</p>
                </div>
              </div>

              <div>
                <p className="font-bold font-sans uppercase underline text-xs text-rose-600 dark:text-rose-400">
                  NOTIS PERINGATAN KEMAJUAN KERJA LEWAT JADUAL DI BAWAH KLAUS SYARAT-SYARAT KONTRAK
                </p>
                <p className="text-xs font-sans mt-0.5 font-semibold text-slate-700 dark:text-slate-300">
                  KONTRAK: {letterData.ref} - {letterData.project}
                </p>
              </div>

              <p className="text-xs font-sans">
                Tuan, dengan hormatnya saya merujuk kepada pemantauan tapak dan mesyuarat kemajuan kerja bertarikh {letterData.date} bagi projek tersebut di atas.
              </p>

              <p className="text-xs font-sans">
                2. Adalah didapati bahawa kemajuan fizikal semasa pihak tuan kini mengalami kelewatan sebanyak <strong className="text-rose-600 font-mono">-{letterData.delay}%</strong> berbanding dengan Jadual Kerja Terperinci (CPM) yang telah dipersetujui.
              </p>

              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 text-xs font-sans text-rose-900 dark:text-rose-200">
                <strong>Arahan Pegawai Penguasa:</strong>
                <p className="mt-1">{letterData.instruction}</p>
              </div>

              <p className="text-xs font-sans">
                3. Sekiranya pihak tuan gagal menunjukkan kemajuan pemulihan yang memuaskan, pihak Jabatan berhak memulakan tindakan lanjut selaras dengan peruntukan penamatan kontrak atau tuntutan Ganti Rugi Tertentu & Ditetapkan (LAD).
              </p>

              <div className="pt-4 font-sans text-xs">
                <p>Sekian, terima kasih.</p>
                <p className="font-bold mt-2 text-amber-500">"MALAYSIA MADANI"</p>
                <p className="font-bold">"BERKHIDMAT UNTUK NEGARA"</p>
                <div className="mt-6">
                  <p className="font-bold underline text-slate-900 dark:text-white">Ir. Mohd Nizam bin Hashim</p>
                  <p className="text-slate-500">Pegawai Penguasa (S.O) / Jurutera Daerah Kanan</p>
                  <p className="text-slate-500">b.p Ketua Pengarah Kerja Raya Malaysia</p>
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2 no-print">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`NOTIS PERINGATAN KEMAJUAN JKR\nKontrak: ${letterData.ref}\nKontraktor: ${letterData.contractor}\nVarians: -${letterData.delay}%\nTarikh: ${letterData.date}`);
                  triggerToast('Teks ringkasan surat berjaya disalin ke papan keratan (clipboard)!');
                }}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold flex items-center gap-1.5 transition"
              >
                <Copy className="w-4 h-4" />
                <span>Salin Teks</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/20 active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Surat Rasmi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING ACTION TOAST                                                     */}
      {/* ========================================================================= */}
      {toast.show && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce duration-300">
          <div className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center gap-3 text-xs max-w-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
            <span className="font-bold tracking-wide">{toast.message}</span>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-white/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 py-6 px-4 sm:px-8 mt-12 no-print backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-800 dark:text-slate-200">Jabatan Kerja Raya Malaysia (JKR)</span>
            <span>&bull; Cawangan Pentadbiran & Kewangan 2026</span>
          </div>
          <div className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400 font-bold">
            Hak Cipta Terpelihara &copy; 2026 Kerajaan Malaysia | SPMP V5.2 JKR (Vibrant Edition)
          </div>
        </div>
      </footer>

    </div>
  );
}

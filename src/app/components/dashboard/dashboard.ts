import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Contact {
  id: number;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  category: 'VIP' | 'Cliente' | 'Proveedor' | 'Equipo' | 'Personal';
  status: 'Activo' | 'Pendiente' | 'Inactivo';
  avatar: string;
  initials: string;
  lastContact: string;
}

export interface Appointment {
  id: number;
  title: string;
  contactName: string;
  contactAvatar?: string;
  time: string;
  date: string;
  type: 'Videollamada' | 'Presencial' | 'Llamada';
  status: 'Confirmada' | 'En curso' | 'Pendiente' | 'Completada';
  location: string;
}

export interface Task {
  id: number;
  title: string;
  dueTime: string;
  priority: 'Alta' | 'Media' | 'Baja';
  completed: boolean;
  tag: string;
}

export interface ActivityMetric {
  day: string;
  citas: number;
  contactos: number;
  citasHeight: number;
  contactosHeight: number;
}

export interface SystemNotification {
  id: number;
  title: string;
  detail: string;
  time: string;
  read: boolean;
  icon: string;
  badgeClass: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  // Sidebar State
  sidebarCollapsed = signal(false);

  // User Dropdown & Notifications State
  notificationsOpen = signal(false);
  userMenuOpen = signal(false);

  // Search & Filters
  searchTerm = signal('');
  selectedCategory = signal<string>('Todos');
  activeTab = signal<'dashboard' | 'contactos' | 'citas' | 'tareas' | 'reportes'>('dashboard');
  chartTimeframe = signal<'semanal' | 'mensual'>('semanal');

  // New Quick Task Input
  newTaskInput = signal('');

  // Modals state
  showContactModal = signal(false);
  showAppointmentModal = signal(false);
  toastMessage = signal<string | null>(null);

  // New Contact Form Model
  newContact = {
    name: '',
    role: '',
    company: '',
    email: '',
    phone: '',
    category: 'Cliente' as Contact['category']
  };

  // New Appointment Form Model
  newAppointment = {
    title: '',
    contactName: '',
    date: new Date().toISOString().substring(0, 10),
    time: '10:00',
    type: 'Videollamada' as Appointment['type'],
    location: 'Google Meet'
  };

  // Current Date display
  currentDate = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  // Notifications List
  notifications = signal<SystemNotification[]>([
    {
      id: 1,
      title: 'Nueva cita confirmada',
      detail: 'Elena Rostova confirmó reunión a las 11:30 AM',
      time: 'Hace 10 min',
      read: false,
      icon: 'fa-calendar-check',
      badgeClass: 'badge-primary'
    },
    {
      id: 2,
      title: 'Nuevo contacto añadido',
      detail: 'Mariana Silva fue agregada a Clientes VIP',
      time: 'Hace 45 min',
      read: false,
      icon: 'fa-user-plus',
      badgeClass: 'badge-info'
    },
    {
      id: 3,
      title: 'Tarea completada',
      detail: 'Sincronización de base de datos exitosa',
      time: 'Hace 2 horas',
      read: true,
      icon: 'fa-check-circle',
      badgeClass: 'badge-success'
    }
  ]);

  // Key KPI Metrics
  metrics = [
    {
      title: 'Total Contactos',
      value: '1,428',
      change: '+14.2%',
      isPositive: true,
      subtext: 'vs. mes anterior',
      icon: 'fa-users',
      gradientClass: 'metric-card-royal',
      progress: 78
    },
    {
      title: 'Citas Hoy',
      value: '24',
      change: '+6 hoy',
      isPositive: true,
      subtext: '5 completadas',
      icon: 'fa-calendar-alt',
      gradientClass: 'metric-card-sky',
      progress: 65
    },
    {
      title: 'Tareas Pendientes',
      value: '12',
      change: '4 de alta prioridad',
      isPositive: false,
      subtext: '8 completadas hoy',
      icon: 'fa-tasks',
      gradientClass: 'metric-card-navy',
      progress: 45
    },
    {
      title: 'Tasa de Efectividad',
      value: '96.8%',
      change: '+2.4%',
      isPositive: true,
      subtext: 'Asistencia y puntualidad',
      icon: 'fa-chart-line',
      gradientClass: 'metric-card-teal',
      progress: 96
    }
  ];

  // Contacts Data
  contacts = signal<Contact[]>([
    {
      id: 1,
      name: 'Elena Rostova',
      role: 'Directora de Operaciones',
      company: 'Nordic Logistics',
      email: 'elena.r@nordiclog.com',
      phone: '+34 612 345 678',
      category: 'VIP',
      status: 'Activo',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      initials: 'ER',
      lastContact: 'Hoy, 10:15 AM'
    },
    {
      id: 2,
      name: 'Carlos Andrés Vega',
      role: 'Gerente Comercial',
      company: 'Soluciones Globales',
      email: 'carlos.vega@sglobales.com',
      phone: '+34 622 987 654',
      category: 'Cliente',
      status: 'Activo',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      initials: 'CV',
      lastContact: 'Ayer'
    },
    {
      id: 3,
      name: 'Valeria Méndez',
      role: 'Consultora de Proyectos',
      company: 'TechInnovate',
      email: 'valeria.m@techinnovate.io',
      phone: '+34 633 112 233',
      category: 'Equipo',
      status: 'Activo',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      initials: 'VM',
      lastContact: 'Hace 3 días'
    },
    {
      id: 4,
      name: 'Mateo Fernández',
      role: 'Proveedor de Infraestructura',
      company: 'CloudCore Systems',
      email: 'm.fernandez@cloudcore.net',
      phone: '+34 644 778 899',
      category: 'Proveedor',
      status: 'Pendiente',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      initials: 'MF',
      lastContact: '14 Septiembre'
    },
    {
      id: 5,
      name: 'Sofía Larrea',
      role: 'Diseñadora UX/UI Lead',
      company: 'DesignFlow Studio',
      email: 'sofia@designflow.co',
      phone: '+34 655 443 322',
      category: 'VIP',
      status: 'Activo',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      initials: 'SL',
      lastContact: 'Hoy, 08:30 AM'
    }
  ]);

  // Appointments / Agenda
  appointments = signal<Appointment[]>([
    {
      id: 1,
      title: 'Revisión Estratégica Q4',
      contactName: 'Elena Rostova',
      contactAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      time: '09:00 - 10:00 AM',
      date: 'Hoy',
      type: 'Videollamada',
      status: 'En curso',
      location: 'Google Meet'
    },
    {
      id: 2,
      title: 'Demostración de Plataforma',
      contactName: 'Carlos Andrés Vega',
      contactAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      time: '11:30 - 12:30 PM',
      date: 'Hoy',
      type: 'Videollamada',
      status: 'Confirmada',
      location: 'Zoom Room #4'
    },
    {
      id: 3,
      title: 'Almuerzo de Negocios & Alianzas',
      contactName: 'Sofía Larrea',
      contactAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      time: '02:00 - 03:30 PM',
      date: 'Hoy',
      type: 'Presencial',
      status: 'Confirmada',
      location: 'Restaurante El Mirador'
    },
    {
      id: 4,
      title: 'Seguimiento de Servicios Cloud',
      contactName: 'Mateo Fernández',
      contactAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      time: '04:45 - 05:15 PM',
      date: 'Hoy',
      type: 'Llamada',
      status: 'Pendiente',
      location: 'Llamada Directa'
    }
  ]);

  // Tasks Data
  tasks = signal<Task[]>([
    {
      id: 1,
      title: 'Preparar presentación para Elena Rostova',
      dueTime: '10:30 AM',
      priority: 'Alta',
      completed: true,
      tag: 'Reunión'
    },
    {
      id: 2,
      title: 'Enviar propuesta comercial actualizada a Soluciones Globales',
      dueTime: '01:00 PM',
      priority: 'Alta',
      completed: false,
      tag: 'Ventas'
    },
    {
      id: 3,
      title: 'Confirmar asistencia para el congreso de innovación',
      dueTime: '03:00 PM',
      priority: 'Media',
      completed: false,
      tag: 'Evento'
    },
    {
      id: 4,
      title: 'Revisar métricas y respaldo semanal de la base de datos',
      dueTime: '06:00 PM',
      priority: 'Baja',
      completed: false,
      tag: 'Sistema'
    }
  ]);

  // Weekly Activity Chart Data (Pure CSS/SVG responsive bars)
  weeklyStats: ActivityMetric[] = [
    { day: 'Lun', citas: 6, contactos: 12, citasHeight: 50, contactosHeight: 75 },
    { day: 'Mar', citas: 9, contactos: 16, citasHeight: 75, contactosHeight: 90 },
    { day: 'Mié', citas: 8, contactos: 14, citasHeight: 65, contactosHeight: 80 },
    { day: 'Jue', citas: 12, contactos: 20, citasHeight: 95, contactosHeight: 100 },
    { day: 'Vie', citas: 10, contactos: 18, citasHeight: 85, contactosHeight: 88 },
    { day: 'Sáb', citas: 4, contactos: 8, citasHeight: 35, contactosHeight: 45 },
    { day: 'Dom', citas: 1, contactos: 3, citasHeight: 15, contactosHeight: 20 }
  ];

  // Filtered Contacts computed
  filteredContacts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const category = this.selectedCategory();

    return this.contacts().filter(c => {
      const matchesCategory = category === 'Todos' || c.category === category;
      const matchesSearch = !term ||
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.company.toLowerCase().includes(term) ||
        c.phone.includes(term);
      return matchesCategory && matchesSearch;
    });
  });

  // Unread notifications count
  unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

  // Methods
  toggleSidebar() {
    this.sidebarCollapsed.update(val => !val);
  }

  toggleNotifications() {
    this.notificationsOpen.update(val => !val);
    if (this.userMenuOpen()) this.userMenuOpen.set(false);
  }

  toggleUserMenu() {
    this.userMenuOpen.update(val => !val);
    if (this.notificationsOpen()) this.notificationsOpen.set(false);
  }

  markAllNotificationsRead() {
    this.notifications.update(items => items.map(n => ({ ...n, read: true })));
    this.showToast('Notificaciones marcadas como leídas');
  }

  setCategory(cat: string) {
    this.selectedCategory.set(cat);
  }

  toggleTask(id: number) {
    this.tasks.update(tasks =>
      tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  addTask() {
    const text = this.newTaskInput().trim();
    if (!text) return;

    const newTaskItem: Task = {
      id: Date.now(),
      title: text,
      dueTime: 'Hoy',
      priority: 'Media',
      completed: false,
      tag: 'General'
    };

    this.tasks.update(tasks => [newTaskItem, ...tasks]);
    this.newTaskInput.set('');
    this.showToast('Tarea añadida correctamente');
  }

  deleteTask(id: number) {
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
    this.showToast('Tarea eliminada');
  }

  openContactModal() {
    this.showContactModal.set(true);
  }

  closeContactModal() {
    this.showContactModal.set(false);
    this.resetContactForm();
  }

  openAppointmentModal() {
    this.showAppointmentModal.set(true);
  }

  closeAppointmentModal() {
    this.showAppointmentModal.set(false);
  }

  saveContact() {
    if (!this.newContact.name.trim() || !this.newContact.email.trim()) {
      alert('Por favor completa al menos el nombre y el correo electrónico.');
      return;
    }

    const initials = this.newContact.name
      .split(' ')
      .map(w => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const created: Contact = {
      id: Date.now(),
      name: this.newContact.name,
      role: this.newContact.role || 'Contacto',
      company: this.newContact.company || 'Particular',
      email: this.newContact.email,
      phone: this.newContact.phone || 'N/A',
      category: this.newContact.category,
      status: 'Activo',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(this.newContact.name)}&background=1d4ed8&color=fff`,
      initials,
      lastContact: 'Recién añadido'
    };

    this.contacts.update(list => [created, ...list]);
    this.closeContactModal();
    this.showToast(`Contacto "${created.name}" guardado exitosamente`);
  }

  saveAppointment() {
    if (!this.newAppointment.title.trim() || !this.newAppointment.contactName.trim()) {
      alert('Por favor completa el título y el nombre del contacto.');
      return;
    }

    const created: Appointment = {
      id: Date.now(),
      title: this.newAppointment.title,
      contactName: this.newAppointment.contactName,
      contactAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(this.newAppointment.contactName)}&background=0284c7&color=fff`,
      time: this.newAppointment.time,
      date: this.newAppointment.date,
      type: this.newAppointment.type,
      status: 'Confirmada',
      location: this.newAppointment.location
    };

    this.appointments.update(list => [created, ...list]);
    this.closeAppointmentModal();
    this.showToast(`Cita "${created.title}" programada exitosamente`);
  }

  deleteContact(id: number) {
    this.contacts.update(list => list.filter(c => c.id !== id));
    this.showToast('Contacto eliminado');
  }

  showToast(message: string) {
    this.toastMessage.set(message);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3500);
  }

  private resetContactForm() {
    this.newContact = {
      name: '',
      role: '',
      company: '',
      email: '',
      phone: '',
      category: 'Cliente'
    };
  }


  jsonData: any[] = [];

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const csvContent = e.target.result;
        console.log('Contenido del CSV:', csvContent);

        // Aquí puedes procesar o parsear el texto del CSV
        this.parseCsvData(csvContent);
        this.jsonData = this.convertCsvToJson(csvContent);
        console.log('JSON Result:', this.jsonData);
      };

      reader.readAsText(file);
    }
  }

  parseCsvData(content: string): void {
    // Separar por saltos de línea para obtener las filas
    const lines = content.split('\n');
    const result = [];

    // Ejemplo básico para recorrer las líneas
    for (let line of lines) {
      if (line.trim()) {
        const row = line.split(';');
        result.push(row);
      }
    }

    console.log('Filas procesadas:', result);
    for (let a of result) {
      console.log(a);
    }

  }
  convertCsvToJson(csvText: string): any[] {
    const lines = csvText.split('\n');
    const result = [];

    // Extraer las cabeceras (primera línea) y limpiar espacios o retornos de carro
    const headers = lines[0].split(',').map(header => header.trim());

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Ignorar líneas vacías

      const obj: any = {};
      const currentline = lines[i].split(',');

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j] ? currentline[j].trim() : '';
      }

      result.push(obj);
    }

    return result;
  }
}

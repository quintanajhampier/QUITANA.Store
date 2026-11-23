import { useState } from 'react'

type Role = 'admin' | 'kitchen' | 'cashier' | 'waiter' | 'client'
type ServiceRequest = {
  id: number
  table: string
  request: string
  comment?: string
  time: string
  status: 'pending' | 'attending' | 'done'
}
type IconName =
  | 'grid' | 'bag' | 'users' | 'chart' | 'message' | 'table' | 'wallet'
  | 'chef' | 'cash' | 'phone' | 'search' | 'bell' | 'arrow' | 'clock'
  | 'check' | 'plus' | 'more' | 'calendar' | 'download' | 'settings'

const iconPaths: Record<IconName, React.ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  bag: <><path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
  message: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/>,
  table: <><path d="M4 5h16M6 5l-2 16M18 5l2 16M5 15h14"/></>,
  wallet: <><path d="M3 7a3 3 0 0 1 3-3h13v16H6a3 3 0 0 1-3-3V7Z"/><path d="M15 10h6v5h-6a2 2 0 0 1 0-5Z"/></>,
  chef: <><path d="M6 10a4 4 0 1 1 3-7 4 4 0 0 1 6 0 4 4 0 1 1 3 7v9H6v-9Z"/><path d="M6 14h12"/></>,
  cash: <><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9h.01M18 15h.01"/></>,
  phone: <><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"/><path d="M10 21h4"/></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  plus: <path d="M12 5v14M5 12h14"/>,
  more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
  download: <><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-.5-.7-1.7 1-1.8-2-2-1.8 1-1.7-.7L11.5 3h-3L8 5l-1.7.7-1.8-1-2 2 1 1.8L2.8 10l-2 .5v3l2 .5.7 1.7-1 1.8 2 2 1.8-1 1.7.7.5 2h3l.5-2 1.7-.7 1.8 1 2-2-1-1.8.7-1.7 2-.5Z"/></>,
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{iconPaths[name]}</svg>
}

const adminNav = [
  ['dashboard', 'Vista general', 'grid'], ['products', 'Productos', 'bag'],
  ['employees', 'Equipo y permisos', 'users'], ['reports', 'Ventas y reportes', 'chart'],
  ['reviews', 'Reseñas privadas', 'message'], ['tables', 'Mesas y QR', 'table'],
  ['expenses', 'Gastos e insumos', 'wallet'],
] as const

const dishes = [
  { name: 'Arroz chaufa especial', desc: 'Pollo, huevo, cebolla china y salsa de la casa', price: 28, image: '/assets/chaufa.png', tag: 'Más pedido' },
  { name: 'Lomo saltado', desc: 'Lomo fino, papas crocantes y arroz blanco', price: 36, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80', tag: 'Chef' },
  { name: 'Ceviche clásico', desc: 'Pesca del día, leche de tigre, choclo y camote', price: 34, image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=800&q=80', tag: 'Fresco' },
]

const orders = [
  { id: '#1048', table: 'Mesa 07', time: '12:42', elapsed: 'Hace 3 min', items: ['2× Arroz chaufa especial', '1× Chicha morada'], note: 'Sin cebolla, por favor' },
  { id: '#1047', table: 'Mesa 03', time: '12:37', elapsed: 'Hace 8 min', items: ['1× Lomo saltado', '2× Inca Kola'], note: '' },
  { id: '#1046', table: 'Mesa 11', time: '12:31', elapsed: 'Hace 14 min', items: ['2× Ceviche clásico', '1× Causa limeña'], note: 'Ají aparte' },
]

function Logo({ compact = false }: { compact?: boolean }) {
  return <div className="logo-wrap"><div className="logo-mark">S</div>{!compact && <div><strong>Salvia</strong><span>RESTAURANT OS</span></div>}</div>
}

function RoleSwitcher({ role, setRole }: { role: Role; setRole: (role: Role) => void }) {
  const roles: [Role, string, IconName][] = [['admin', 'Admin', 'grid'], ['kitchen', 'Cocina', 'chef'], ['cashier', 'Caja', 'cash'], ['waiter', 'Mozos', 'bell'], ['client', 'Cliente', 'phone']]
  return <div className="role-switcher">
    {roles.map(([id, label, icon]) => <button className={role === id ? 'active' : ''} onClick={() => setRole(id)} key={id}><Icon name={icon} size={16}/><span>{label}</span></button>)}
  </div>
}

function TopBar({ title, subtitle }: { title: string; subtitle: string }) {
  return <header className="topbar">
    <div><p className="eyebrow">{subtitle}</p><h1>{title}</h1></div>
    <div className="top-actions">
      <div className="live"><i/> Operación en vivo</div>
      <button className="icon-button"><Icon name="bell"/><b>3</b></button>
      <div className="avatar">CM</div>
      <div className="user-meta"><strong>Camila Mendoza</strong><span>Administradora</span></div>
    </div>
  </header>
}

function AdminDashboard() {
  const metrics = [
    ['Ventas de hoy', 'S/ 4,280', '+12.5%', 'spark-a'],
    ['Pedidos', '128', '9 activos', 'spark-b'],
    ['Mesas ocupadas', '12 / 18', '67%', 'spark-c'],
    ['Ticket promedio', 'S/ 33.40', '+4.2%', 'spark-d'],
  ]
  return <div className="dashboard">
    <section className="metric-grid">
      {metrics.map((m, i) => <article className="metric-card" key={m[0]}>
        <div className={`metric-icon m${i}`}><Icon name={i === 0 ? 'wallet' : i === 1 ? 'bag' : i === 2 ? 'table' : 'chart'}/></div>
        <p>{m[0]}</p><div className="metric-value"><strong>{m[1]}</strong><span className={i === 1 ? 'neutral' : ''}>{m[2]}</span></div>
        <div className={`mini-spark ${m[3]}`}><i/><i/><i/><i/><i/><i/><i/><i/></div>
      </article>)}
    </section>
    <section className="dashboard-grid">
      <article className="panel sales-panel">
        <div className="panel-head"><div><p className="eyebrow">RENDIMIENTO</p><h2>Ventas de la semana</h2></div><button className="select-button"><Icon name="calendar"/> 11–17 Nov. <span>⌄</span></button></div>
        <div className="chart-summary"><strong>S/ 24,860</strong><span>+8.4% vs. semana anterior</span></div>
        <div className="bar-chart">
          {[52, 67, 58, 80, 72, 94, 66].map((h, i) => <div className="bar-col" key={i}><div className="bar-track"><i style={{height: `${h}%`}} className={i === 5 ? 'focus' : ''}/></div><span>{['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'][i]}</span></div>)}
        </div>
      </article>
      <article className="panel activity-panel">
        <div className="panel-head"><div><p className="eyebrow">AHORA</p><h2>Actividad en vivo</h2></div><button className="text-button">Ver todo <Icon name="arrow" size={15}/></button></div>
        {[
          ['#1048', 'Mesa 07', 'En preparación', 'amber', '2 min'],
          ['#1047', 'Mesa 03', 'Listo para entregar', 'green', '5 min'],
          ['#1046', 'Mesa 11', 'Pendiente de pago', 'purple', '12 min'],
          ['#1045', 'Mesa 02', 'Pedido aceptado', 'blue', '14 min'],
        ].map((a) => <div className="activity-row" key={a[0]}><div className={`status-dot ${a[3]}`}/><div><strong>{a[0]} · {a[1]}</strong><span>{a[2]}</span></div><time>{a[4]}</time></div>)}
      </article>
      <article className="panel top-products">
        <div className="panel-head"><div><p className="eyebrow">MENÚ</p><h2>Más vendidos</h2></div><button className="text-button">Gestionar</button></div>
        {dishes.map((d, i) => <div className="product-rank" key={d.name}><b>0{i+1}</b><img src={d.image}/><div><strong>{d.name}</strong><span>{[42, 35, 29][i]} unidades</span></div><em>S/ {[1176, 1260, 986][i].toLocaleString()}</em></div>)}
      </article>
      <article className="panel payment-split">
        <div className="panel-head"><div><p className="eyebrow">COBROS</p><h2>Métodos de pago</h2></div></div>
        <div className="donut"><div><strong>128</strong><span>pagos</span></div></div>
        <div className="legend"><p><i className="cash-color"/>Efectivo <strong>S/ 2,610</strong><span>61%</span></p><p><i className="yape-color"/>Yape <strong>S/ 1,670</strong><span>39%</span></p></div>
      </article>
    </section>
  </div>
}

function ProductsView() {
  return <div className="module-view">
    <div className="module-toolbar"><div className="search"><Icon name="search"/><input placeholder="Buscar producto o categoría"/></div><button className="filter-button">Todas las categorías⌄</button><button className="primary"><Icon name="plus"/> Nuevo producto</button></div>
    <div className="category-tabs"><button className="active">Todos <b>42</b></button><button>Entradas <b>8</b></button><button>Fondos <b>18</b></button><button>Bebidas <b>12</b></button><button>Postres <b>4</b></button></div>
    <div className="table-card">
      <div className="data-row data-head"><span>PRODUCTO</span><span>CATEGORÍA</span><span>PRECIO</span><span>DISPONIBILIDAD</span><span>VENTAS</span><span></span></div>
      {[...dishes, { name:'Causa limeña', desc:'Papa amarilla y pollo', price:24, image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=300&q=70', tag:'' }].map((d, i) => <div className="data-row" key={d.name}>
        <span className="product-cell"><img src={d.image}/><span><strong>{d.name}</strong><small>{d.desc}</small></span></span>
        <span>{i === 2 ? 'Pescados' : i === 3 ? 'Entradas' : 'Fondos'}</span><strong>S/ {d.price.toFixed(2)}</strong>
        <span><i className={`toggle ${i === 3 ? '' : 'on'}`} /> {i === 3 ? 'Agotado' : 'Disponible'}</span>
        <span>{[42,35,29,18][i]} uds.</span><button className="icon-button"><Icon name="more"/></button>
      </div>)}
    </div>
  </div>
}

function TablesView() {
  const tables = [
    ['01','Disponible','0','S/ 0','free'],['02','Ocupada','2','S/ 64','busy'],['03','Pedido listo','3','S/ 102','ready'],
    ['04','Disponible','0','S/ 0','free'],['05','Cuenta pendiente','2','S/ 87','due'],['06','Ocupada','1','S/ 36','busy'],
    ['07','En preparación','2','S/ 82','prep'],['08','Disponible','0','S/ 0','free'],
  ]
  return <div className="module-view">
    <div className="module-toolbar"><div className="summary-pills"><span><i className="free"/>6 disponibles</span><span><i className="busy"/>12 ocupadas</span></div><button className="secondary"><Icon name="download"/> Descargar QR</button><button className="primary"><Icon name="plus"/> Nueva mesa</button></div>
    <div className="tables-grid">{tables.map(t => <article className="table-tile" key={t[0]}>
      <div className="table-tile-top"><span>MESA</span><button><Icon name="more"/></button></div><strong>{t[0]}</strong><span className={`status-badge ${t[4]}`}><i/>{t[1]}</span>
      <div className="table-meta"><span>Pedidos <b>{t[2]}</b></span><span>Pendiente <b>{t[3]}</b></span></div>
      <div className="fake-qr">{Array.from({length:25}).map((_,i)=><i key={i} className={(i*7)%4 === 0 || [0,1,5,6,18,19,23,24].includes(i) ? 'dark':''}/>)}</div>
      <button className="tile-action">Ver detalle <Icon name="arrow" size={15}/></button>
    </article>)}</div>
  </div>
}

function GenericModule({ view }: { view: string }) {
  const data: Record<string, { title: string; intro: string; icon: IconName; rows: string[][] }> = {
    employees: {title:'Equipo del restaurante',intro:'Administra roles, permisos y actividad del personal.',icon:'users',rows:[['Lucía Torres','Caja','Activa','Hoy, 12:40'],['Marco Ríos','Cocina','Activo','Hoy, 12:38'],['Elena Paz','Administradora','Activa','Hoy, 11:52']]},
    reports: {title:'Ventas y reportes',intro:'Solo los cobros validados se incluyen como ingresos.',icon:'chart',rows:[['Ventas cobradas','S/ 4,280','128 operaciones','+12.5%'],['Pedidos entregados','134','6 por cobrar','94%'],['Mesas atendidas','47','Ticket S/ 91.06','+8.2%']]},
    reviews: {title:'Reseñas privadas',intro:'Comentarios visibles únicamente para administradores autorizados.',icon:'message',rows:[['Calidad de comida','“El chaufa estuvo excelente”','Positiva','Revisada'],['Tiempo de espera','“Demoró más de 25 minutos”','Atención media','Pendiente'],['Limpieza','“Todo impecable”','Positiva','Revisada']]},
    expenses: {title:'Control de gastos e ingredientes',intro:'Cuaderno administrativo de compras, proveedores e insumos.',icon:'wallet',rows:[['Arroz superior','25 kg','S/ 112.50','Mercado Central'],['Aceite vegetal','12 litros','S/ 96.00','Distribuidora Sol'],['Verduras mixtas','18 kg','S/ 144.00','Huerto Norte']]},
  }
  const d = data[view] || data.reports
  return <div className="module-view">
    <div className="feature-banner"><div className="feature-icon"><Icon name={d.icon}/></div><div><h2>{d.title}</h2><p>{d.intro}</p></div><button className="primary"><Icon name="plus"/> Nuevo registro</button></div>
    <div className="report-strip"><div><span>HOY</span><strong>S/ 4,280</strong></div><div><span>ESTA SEMANA</span><strong>S/ 24,860</strong></div><div><span>ESTE MES</span><strong>S/ 92,430</strong></div><button className="select-button"><Icon name="calendar"/> 18 Nov. 2026</button></div>
    <div className="simple-list"><div className="simple-head"><span>DETALLE</span><span>INFORMACIÓN</span><span>ESTADO / TOTAL</span><span>REFERENCIA</span></div>{d.rows.map(r=><div className="simple-row" key={r[0]}>{r.map((v,i)=><span key={v} className={i===0?'strong':''}>{v}</span>)}</div>)}</div>
  </div>
}

function AdminApp({ setRole }: { setRole: (role: Role) => void }) {
  const [view, setView] = useState('dashboard')
  const current = adminNav.find(n => n[0] === view)
  return <div className="admin-shell">
    <aside className="sidebar"><Logo/><div className="restaurant-chip"><div>CM</div><span><small>RESTAURANTE</small><strong>Casa Misti</strong></span><b>⌄</b></div>
      <nav><p>GESTIÓN</p>{adminNav.map(([id,label,icon])=><button className={view===id?'active':''} onClick={()=>setView(id)} key={id}><Icon name={icon}/><span>{label}</span>{id==='reviews'&&<b>3</b>}</button>)}</nav>
      <div className="sidebar-bottom"><button><Icon name="settings"/>Configuración</button><div className="help-card"><strong>Centro de ayuda</strong><span>¿Necesitas asistencia?</span><button>Contactar soporte</button></div></div>
    </aside>
    <main className="admin-main"><TopBar title={current?.[1] || 'Vista general'} subtitle={view==='dashboard'?'MIÉRCOLES, 18 DE NOVIEMBRE': 'ADMINISTRACIÓN'}/>
      <div className="admin-content">{view==='dashboard'?<AdminDashboard/>:view==='products'?<ProductsView/>:view==='tables'?<TablesView/>:<GenericModule view={view}/>}</div>
    </main>
    <div className="floating-role"><RoleSwitcher role="admin" setRole={setRole}/></div>
  </div>
}

function KitchenApp({ setRole }: { setRole: (role: Role) => void }) {
  const [moved, setMoved] = useState<string[]>([])
  const columns = [
    {title:'Pedidos nuevos',count:3,color:'new',action:'Aceptar pedido'},
    {title:'En preparación',count:4,color:'prep',action:'Marcar como listo'},
    {title:'Listos para entregar',count:2,color:'ready',action:'Confirmar entrega'},
  ]
  return <div className="ops-shell">
    <header className="ops-header"><Logo/><div className="ops-title"><Icon name="chef"/><div><strong>Panel de cocina</strong><span>Servicio de almuerzo · 9 pedidos activos</span></div></div><div className="ops-right"><span className="time">12:45 PM</span><button className="icon-button"><Icon name="bell"/><b>2</b></button><div className="avatar">MR</div></div></header>
    <main className="kitchen-main"><div className="kitchen-summary"><div><p className="eyebrow">COCINA EN VIVO</p><h1>Buen servicio, equipo.</h1></div><div className="speed"><Icon name="clock"/><div><span>Tiempo promedio</span><strong>14 min</strong></div></div></div>
      <div className="kanban">{columns.map((col, ci)=><section className={`kanban-col ${col.color}`} key={col.title}><div className="kanban-head"><div><i/><h2>{col.title}</h2><b>{col.count}</b></div><button><Icon name="more"/></button></div>
        <div className="order-stack">{orders.map((o, oi)=> (oi+ci)%3 !== 2 || ci===1 ? <article className={`order-card ${moved.includes(`${ci}-${oi}`)?'completed':''}`} key={o.id+ci}>
          <div className="order-top"><div><span>PEDIDO</span><strong>{o.id}</strong></div><span className="table-number">{o.table}</span></div>
          <div className="order-time"><Icon name="clock" size={15}/><span>{ci===1?`${8+oi} min en preparación`:o.elapsed}</span><time>{o.time}</time></div>
          <ul>{o.items.map(item=><li key={item}><b>{item.split('×')[0]}×</b><span>{item.split('×')[1]}</span></li>)}</ul>
          {o.note&&<div className="order-note"><strong>NOTA</strong><span>{o.note}</span></div>}
          <button className="order-action" onClick={()=>setMoved([...moved,`${ci}-${oi}`])}>{moved.includes(`${ci}-${oi}`)?<><Icon name="check"/> Actualizado</>:<>{col.action}<Icon name="arrow"/></>}</button>
        </article>:null)}</div>
      </section>)}</div>
    </main><div className="floating-role"><RoleSwitcher role="kitchen" setRole={setRole}/></div>
  </div>
}

function CashierApp({ setRole }: { setRole: (role: Role) => void }) {
  const [selected, setSelected] = useState(7)
  const [paid, setPaid] = useState(false)
  return <div className="ops-shell cashier-shell"><header className="ops-header"><Logo/><div className="ops-title"><Icon name="cash"/><div><strong>Panel de caja</strong><span>Turno de Lucía · Caja 01</span></div></div><div className="ops-right"><div className="live"><i/> Sincronizado</div><button className="icon-button"><Icon name="bell"/></button><div className="avatar">LT</div></div></header>
    <main className="cashier-main"><section className="accounts"><div className="section-title"><div><p className="eyebrow">CUENTAS ABIERTAS</p><h1>Mesas por cobrar</h1></div><div className="search compact"><Icon name="search"/><input placeholder="Buscar mesa"/></div></div>
      <div className="account-filters"><button className="active">Todas <b>7</b></button><button>Por entregar <b>3</b></button><button>Por cobrar <b>4</b></button></div>
      {[7,5,11,3].map((n,i)=><button onClick={()=>setSelected(n)} className={`account-row ${selected===n?'selected':''}`} key={n}><div className={`account-icon ${i===0?'due':i===1?'ready':'prep'}`}><Icon name="table"/></div><div><strong>Mesa {String(n).padStart(2,'0')}</strong><span>{[2,2,1,3][i]} pedidos · Último hace {[3,8,12,16][i]} min</span></div><span className={`status-badge ${i===0?'due':i===1?'ready':'prep'}`}>{i===0?'Por cobrar':i===1?'Entregado':'En preparación'}</span><strong>S/ {[82,87,36,102][i]}.00</strong><Icon name="arrow"/></button>)}
    </section>
    <aside className="checkout"><div className="checkout-head"><span>DETALLE DE CUENTA</span><h2>Mesa {String(selected).padStart(2,'0')}</h2><p>2 pedidos independientes</p></div>
      <div className="checkout-order"><div><strong>Pedido #1048</strong><span className="status-badge ready">Entregado</span></div><p><span>2 × Arroz chaufa</span><b>S/ 56.00</b></p><p><span>1 × Chicha morada</span><b>S/ 8.00</b></p></div>
      <div className="checkout-order"><div><strong>Pedido #1051</strong><span className="status-badge ready">Entregado</span></div><p><span>1 × Inca Kola</span><b>S/ 8.00</b></p><p><span>1 × Causa limeña</span><b>S/ 10.00</b></p></div>
      <div className="total-line"><span>Total pendiente</span><strong>S/ 82.00</strong></div>
      <div className="payment-method"><span>MÉTODO DE PAGO</span><div><button className="active"><Icon name="cash"/>Efectivo</button><button><b className="yape-dot">Y</b>Yape</button></div></div>
      <label className="amount-input"><span>Importe recibido</span><div><b>S/</b><input defaultValue="100.00"/></div></label>
      <div className="change"><span>Vuelto</span><strong>S/ 18.00</strong></div>
      <button onClick={()=>setPaid(true)} className={`pay-button ${paid?'paid':''}`}>{paid?<><Icon name="check"/>Pago registrado</>:<>Confirmar pago · S/ 82.00<Icon name="arrow"/></>}</button>
      <p className="release-note">La mesa se liberará cuando todos los pedidos estén entregados y pagados.</p>
    </aside></main><div className="floating-role"><RoleSwitcher role="cashier" setRole={setRole}/></div>
  </div>
}

function WaiterApp({ setRole, requests, updateRequest }: { setRole: (role: Role) => void; requests: ServiceRequest[]; updateRequest: (id: number, status: ServiceRequest['status']) => void }) {
  const active = requests.filter(request => request.status !== 'done')
  const completed = requests.filter(request => request.status === 'done')
  return <div className="ops-shell waiter-shell">
    <header className="ops-header"><Logo/><div className="ops-title"><Icon name="bell"/><div><strong>Atención de mesas</strong><span>Panel exclusivo para mozos · Salón principal</span></div></div><div className="ops-right"><div className="live"><i/> Solicitudes en vivo</div><button className="icon-button"><Icon name="bell"/>{active.length>0&&<b>{active.length}</b>}</button><div className="avatar">JP</div></div></header>
    <main className="waiter-main">
      <section className="waiter-heading"><div><p className="eyebrow">SERVICIO EN SALÓN</p><h1>Peticiones de clientes</h1><p>Recibe y atiende las solicitudes enviadas desde cada mesa.</p></div><div className="waiter-stats"><article><span>PENDIENTES</span><strong>{requests.filter(r=>r.status==='pending').length}</strong></article><article><span>EN CAMINO</span><strong>{requests.filter(r=>r.status==='attending').length}</strong></article><article><span>ATENDIDAS</span><strong>{completed.length}</strong></article></div></section>
      <div className="waiter-layout"><section className="request-feed"><div className="feed-head"><div><i/><h2>Solicitudes activas</h2><b>{active.length}</b></div><span>Actualizado ahora</span></div>
        {active.length===0?<div className="empty-requests"><div><Icon name="check"/></div><h3>Todo está atendido</h3><p>Las nuevas solicitudes aparecerán aquí en tiempo real.</p></div>:active.map(item=><article className={`service-request ${item.status}`} key={item.id}>
          <div className="request-table"><span>MESA</span><strong>{item.table}</strong></div>
          <div className="request-detail"><div><span className={`request-state ${item.status}`}><i/>{item.status==='pending'?'Nueva solicitud':'Mozo en camino'}</span><time><Icon name="clock" size={13}/>{item.time}</time></div><h3>Mesa {item.table} necesita {item.request.toLowerCase()}</h3>{item.comment&&<p>“{item.comment}”</p>}<small>Solicitud #{String(item.id).slice(-4).padStart(4,'0')} · Enviada desde el menú QR</small></div>
          <div className="request-actions">{item.status==='pending'?<button onClick={()=>updateRequest(item.id,'attending')}>Voy a atender <Icon name="arrow"/></button>:<><button className="complete-request" onClick={()=>updateRequest(item.id,'done')}><Icon name="check"/> Marcar atendida</button><button className="request-more"><Icon name="more"/></button></>}</div>
        </article>)}
      </section>
      <aside className="waiter-side"><div className="shift-card"><p className="eyebrow">TU TURNO</p><div><div className="avatar">JP</div><span><strong>José Paredes</strong><small>Mozo · Zona A</small></span><i>Activo</i></div><p>Mesas asignadas</p><strong>01 — 09</strong></div>
        <div className="recent-card"><div><h2>Atendidas recientemente</h2><Icon name="check"/></div>{completed.slice(0,3).map(item=><p key={item.id}><span><strong>Mesa {item.table} · {item.request}</strong><small>{item.time}</small></span><i><Icon name="check" size={12}/></i></p>)}</div>
        <div className="service-tip"><Icon name="bell"/><div><strong>Respuesta rápida</strong><p>Las mesas reciben una confirmación cuando tomas su solicitud.</p></div></div>
      </aside></div>
    </main><div className="floating-role"><RoleSwitcher role="waiter" setRole={setRole}/></div>
  </div>
}

function ClientApp({ setRole, onRequest }: { setRole: (role: Role) => void; onRequest: (request: Omit<ServiceRequest, 'id' | 'time' | 'status'>) => void }) {
  const [tab, setTab] = useState<'menu'|'orders'|'pay'|'review'>('menu')
  const [cart, setCart] = useState(1)
  const [detail, setDetail] = useState<(typeof dishes)[0] | null>(null)
  const [sent, setSent] = useState(false)
  const [attention, setAttention] = useState(false)
  const [attentionSent, setAttentionSent] = useState(false)
  const [attentionOption, setAttentionOption] = useState('')
  const [attentionText, setAttentionText] = useState('')
  return <div className="client-bg"><div className="phone-app">
    <header className="client-header"><Logo/><button className="client-table"><span>MESA</span><strong>07</strong></button></header>
    <div className="welcome"><div><p>Buenas tardes,</p><h1>¿Qué se te antoja hoy?</h1></div><button aria-label="Solicitar atención" onClick={()=>{setAttention(true);setAttentionSent(false)}} className="icon-button attention-bell"><Icon name="bell"/><span>Atención</span></button></div>
    {tab==='menu'&&<><div className="client-search"><Icon name="search"/><input placeholder="Buscar en la carta…"/></div><div className="food-tabs"><button className="active">Todo</button><button>Entradas</button><button>Fondos</button><button>Bebidas</button></div>
      <div className="hero-dish" onClick={()=>setDetail(dishes[0])}><img src="/assets/chaufa.png"/><div className="hero-overlay"/><div className="dish-tag">FAVORITO DE LA CASA</div><div className="hero-copy"><h2>Arroz chaufa especial</h2><p>Wok, sabor y ese toque de casa.</p><strong>S/ 28</strong><button onClick={(e)=>{e.stopPropagation();setCart(cart+1)}}><Icon name="plus"/></button></div></div>
      <div className="section-row"><h2>Los más pedidos</h2><button>Ver todos</button></div><div className="client-products">{dishes.slice(1).map(d=><article onClick={()=>setDetail(d)} key={d.name}><img src={d.image}/><span>{d.tag}</span><h3>{d.name}</h3><p>{d.desc}</p><div><strong>S/ {d.price}</strong><button onClick={(e)=>{e.stopPropagation();setCart(cart+1)}}><Icon name="plus"/></button></div></article>)}</div>
    </>}
    {tab==='orders'&&<div className="client-page"><p className="eyebrow">MESA 07</p><h1>Mis pedidos</h1>
      <div className="client-order-card"><div><span>PEDIDO #1048</span><b>En preparación</b></div><h3>Tu pedido está en buenas manos</h3><div className="timeline">{['Enviado','Aceptado','En preparación','Listo','Entregado'].map((s,i)=><div className={i<3?'done':''} key={s}><i>{i<3?<Icon name="check" size={13}/>:''}</i><span>{s}</span></div>)}</div><div className="order-total"><span>3 productos · 12:42</span><strong>S/ 64.00</strong></div></div>
      <div className="rule-card"><Icon name="bag"/><div><strong>¿Deseas algo más?</strong><p>Los pedidos enviados no pueden modificarse. Crea uno nuevo y lo procesaremos por separado.</p><button onClick={()=>setTab('menu')}>Realizar nuevo pedido <Icon name="arrow"/></button></div></div>
    </div>}
    {tab==='pay'&&<div className="client-page"><p className="eyebrow">TU CUENTA</p><h1>Pagos</h1><div className="balance-card"><span>SALDO PENDIENTE</span><strong>S/ 82.00</strong><p>2 pedidos entregados</p></div><h3>Elige cómo pagar</h3><button className="client-pay"><Icon name="cash"/><div><strong>Efectivo</strong><span>Paga directamente en caja</span></div><Icon name="arrow"/></button><button className="client-pay"><b className="yape-dot">Y</b><div><strong>Yape</strong><span>Adjunta tu comprobante</span></div><Icon name="arrow"/></button><div className="payment-history"><h3>Historial</h3><p><Icon name="check"/><span>Pedido #1032 · Efectivo<small>Hoy, 11:18</small></span><strong>S/ 24.00</strong></p></div></div>}
    {tab==='review'&&<div className="client-page"><p className="eyebrow">SOLO PARA NOSOTROS</p><h1>Cuéntanos tu experiencia</h1><p className="page-intro">Tu opinión es privada y solo será leída por la administración de Casa Misti.</p><div className="rating">{[1,2,3,4,5].map(n=><button className={n<5?'active':''} key={n}>★</button>)}</div><label className="form-label">¿Sobre qué quieres comentar?</label><div className="review-tags"><button className="active">Comida</button><button>Atención</button><button>Limpieza</button><button>Tiempo</button></div><label className="form-label">Tu comentario</label><textarea placeholder="Cuéntanos qué ocurrió o cómo podemos mejorar…"/><button className="client-submit">Enviar comentario privado <Icon name="arrow"/></button><div className="privacy"><Icon name="message"/><span>Tu identidad y comentario nunca se publicarán.</span></div></div>}
    <nav className="client-nav"><button className={tab==='menu'?'active':''} onClick={()=>setTab('menu')}><Icon name="grid"/><span>Menú</span></button><button className={tab==='orders'?'active':''} onClick={()=>setTab('orders')}><Icon name="bag"/><span>Pedidos</span></button><button className={tab==='pay'?'active':''} onClick={()=>setTab('pay')}><Icon name="wallet"/><span>Pagos</span></button><button className={tab==='review'?'active':''} onClick={()=>setTab('review')}><Icon name="message"/><span>Opinión</span></button></nav>
    {cart>0&&tab==='menu'&&<button className="cart-bar" onClick={()=>setSent(true)}><span><b>{cart}</b> Ver mi pedido</span><strong>S/ {cart*28}.00 <Icon name="arrow"/></strong></button>}
    {detail&&<div className="modal-backdrop" onClick={()=>setDetail(null)}><div className="product-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setDetail(null)}>×</button><img src={detail.image}/><div><span className="dish-tag">{detail.tag}</span><h2>{detail.name}</h2><p>{detail.desc}. Preparado al momento con ingredientes seleccionados.</p><label>Observaciones</label><textarea placeholder="Ej. sin cebolla, ají aparte…"/><button onClick={()=>{setCart(cart+1);setDetail(null)}}>Agregar · S/ {detail.price}.00</button></div></div></div>}
    {sent&&<div className="modal-backdrop"><div className="confirm-modal"><div className="confirm-icon"><Icon name="check"/></div><h2>¡Pedido listo para enviar!</h2><p>Se creará un pedido independiente para la Mesa 07. El restaurante deberá aprobarlo antes de enviarlo a cocina.</p><div><span>Total</span><strong>S/ {cart*28}.00</strong></div><button onClick={()=>{setSent(false);setTab('orders')}}>Confirmar y enviar pedido</button><button className="ghost" onClick={()=>setSent(false)}>Seguir explorando</button></div></div>}
    {attention&&<div className="modal-backdrop attention-backdrop" onClick={()=>setAttention(false)}><div className="attention-modal" onClick={e=>e.stopPropagation()}>
      {!attentionSent?<><div className="attention-heading"><div className="attention-icon"><Icon name="bell"/></div><div><span>SOLICITAR ATENCIÓN</span><h2>¿Qué necesitas?</h2></div><button onClick={()=>setAttention(false)}>×</button></div>
        <p className="attention-intro">Enviaremos tu solicitud al personal para que se acerque a la Mesa 07.</p>
        <div className="attention-options">
          {['Más sal','Más cremas','Una cuchara','Servilletas','Cubiertos','Llamar al mesero'].map(option=><button className={attentionOption===option?'active':''} onClick={()=>setAttentionOption(option)} key={option}><i>{option==='Más sal'?'S':option==='Más cremas'?'C':option==='Una cuchara'?'⌁':option==='Servilletas'?'▤':option==='Cubiertos'?'⋔':'!'}</i><span>{option}</span>{attentionOption===option&&<Icon name="check" size={14}/>}</button>)}
        </div>
        <label className="form-label">¿Necesitas algo diferente?</label>
        <textarea value={attentionText} onChange={e=>setAttentionText(e.target.value)} placeholder="Escribe aquí lo que necesitas…"/>
        <button className="attention-submit" disabled={!attentionOption&&!attentionText.trim()} onClick={()=>{onRequest({table:'07',request:attentionOption||'Solicitud especial',comment:attentionText.trim()||undefined});setAttentionSent(true)}}>Enviar solicitud <Icon name="arrow"/></button>
        <p className="attention-note">Esta solicitud no genera un pedido ni un cobro adicional.</p>
      </>:<div className="attention-success"><div className="confirm-icon"><Icon name="check"/></div><span>SOLICITUD ENVIADA</span><h2>Ya avisamos al personal</h2><p>Tu solicitud de <strong>{(attentionOption||attentionText).toLowerCase()}</strong> fue enviada. Alguien se acercará pronto a la Mesa 07.</p><div className="attention-status"><i/><span>Buscando personal disponible</span></div><button onClick={()=>setAttention(false)}>Entendido</button></div>}
    </div></div>}
  </div><div className="client-role"><RoleSwitcher role="client" setRole={setRole}/></div></div>
}

export default function App() {
  const [role, setRole] = useState<Role>('admin')
  const [requests, setRequests] = useState<ServiceRequest[]>([
    {id:3021,table:'09',request:'Más cremas',comment:'Por favor, mayonesa y ají de la casa.',time:'Hace 1 min',status:'pending'},
    {id:3020,table:'04',request:'Agua',comment:'Un vaso con agua sin hielo.',time:'Hace 3 min',status:'pending'},
    {id:3019,table:'03',request:'Una cuchara',time:'Hace 5 min',status:'attending'},
    {id:3018,table:'06',request:'Servilletas',time:'12:36',status:'done'},
  ])
  const addRequest = (request: Omit<ServiceRequest, 'id' | 'time' | 'status'>) => setRequests(current => [{...request,id:Date.now(),time:'Ahora',status:'pending'},...current])
  const updateRequest = (id: number, status: ServiceRequest['status']) => setRequests(current => current.map(request => request.id===id?{...request,status}:request))
  if (role === 'kitchen') return <KitchenApp setRole={setRole}/>
  if (role === 'cashier') return <CashierApp setRole={setRole}/>
  if (role === 'waiter') return <WaiterApp setRole={setRole} requests={requests} updateRequest={updateRequest}/>
  if (role === 'client') return <ClientApp setRole={setRole} onRequest={addRequest}/>
  return <AdminApp setRole={setRole}/>
}

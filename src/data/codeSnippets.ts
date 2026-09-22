import { SnippetItem, SupportedLanguage, CamperLevel } from '../types';

export const CODE_SNIPPETS: SnippetItem[] = [
  // ================= JAVASCRIPT =================
  {
    id: 'js-jun-1',
    language: 'javascript',
    level: 'junior',
    title: 'Declaración y Bucle Básico',
    description: 'Arreglos y acumulación con bucles en JavaScript moderno.',
    code: `const numbers = [10, 25, 42, 88];
let totalSum = 0;

for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] % 2 === 0) {
    totalSum += numbers[i];
  }
}
console.log("Suma pares:", totalSum);`
  },
  {
    id: 'js-jun-2',
    language: 'javascript',
    level: 'junior',
    title: 'Funciones y Objetos Literales',
    description: 'Creación de entidades de campers con desestructuración.',
    code: `function crearCamper(nombre, lenguaje) {
  return {
    nombre,
    lenguaje,
    nivel: "Junior",
    activo: true,
    saludar() {
      return \`Hola, soy \${this.nombre} y programo en \${this.lenguaje}\`;
    }
  };
}`
  },
  {
    id: 'js-mid-1',
    language: 'javascript',
    level: 'mid',
    title: 'Promesas y Async / Await',
    description: 'Petición asíncrona segura con bloque try/catch en Node.js.',
    code: `async function fetchCamperStats(camperId) {
  try {
    const res = await fetch(\`/api/campers/\${camperId}\`);
    if (!res.ok) throw new Error(\`HTTP error: \${res.status}\`);
    const { username, score, skills } = await res.json();
    return { username, wpm: score.wpm, topSkill: skills[0] };
  } catch (err) {
    console.error("Error al cargar camper:", err.message);
    return null;
  }
}`
  },
  {
    id: 'js-sen-1',
    language: 'javascript',
    level: 'senior',
    title: 'Patrón Middleware / Composición',
    description: 'Pipeline funcional de interceptores asíncronos.',
    code: `const composeMiddleware = (...middlewares) => {
  return (initialContext) => {
    return middlewares.reduceRight(
      (next, fn) => async (ctx) => fn(ctx, () => next(ctx)),
      async (ctx) => ctx
    )(initialContext);
  };
};`
  },

  // ================= TYPESCRIPT =================
  {
    id: 'ts-jun-1',
    language: 'typescript',
    level: 'junior',
    title: 'Interfaces y Tipado de Funciones',
    description: 'Definición de contrato de datos para estudiantes.',
    code: `interface CamperProfile {
  id: string;
  name: string;
  wpm: number;
  level: "Junior" | "Mid" | "Senior";
}

function printBadge(camper: CamperProfile): string {
  return \`[\${camper.level.toUpperCase()}] \${camper.name} (\${camper.wpm} WPM)\`;
}`
  },
  {
    id: 'ts-mid-1',
    language: 'typescript',
    level: 'mid',
    title: 'Genéricos y Manipulación de Tipos',
    description: 'Creación de un contenedor genérico inmutable.',
    code: `type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

function safeParse<T>(jsonStr: string): Result<T> {
  try {
    const parsed = JSON.parse(jsonStr) as T;
    return { success: true, data: parsed };
  } catch (err) {
    return { success: false, error: err as Error };
  }
}`
  },
  {
    id: 'ts-sen-1',
    language: 'typescript',
    level: 'senior',
    title: 'Conditional Types y Template Literals',
    description: 'Inferencia recursiva y tipado estricto de eventos.',
    code: `type EventAction<T extends string> = \`on\${Capitalize<T>}\`;
type EventMap = { click: MouseEvent; keypress: KeyboardEvent };

type StrictListener<K extends keyof EventMap> = {
  [P in K as EventAction<P>]: (event: EventMap[P]) => void;
};`
  },

  // ================= PYTHON =================
  {
    id: 'py-jun-1',
    language: 'python',
    level: 'junior',
    title: 'List Comprehensions y Diccionarios',
    description: 'Transformación de datos y filtrado idiomático en Python.',
    code: `campers = ["Carlos", "Valentina", "Mateo", "Sofia"]
scores = [85, 92, 78, 95]

top_campers = {
    name: score 
    for name, score in zip(campers, scores) 
    if score >= 90
}
print(f"Campers destacados: {top_campers}")`
  },
  {
    id: 'py-mid-1',
    language: 'python',
    level: 'mid',
    title: 'Decoradores y Context Managers',
    description: 'Decorador para medir tiempo de ejecución de algoritmos.',
    code: `import time
from functools import wraps

def timing_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        duration = time.perf_counter() - start
        print(f"[{func.__name__}] ejecutado en {duration:.4f}s")
        return result
    return wrapper`
  },
  {
    id: 'py-sen-1',
    language: 'python',
    level: 'senior',
    title: 'Generadores Asíncronos y Asyncio',
    description: 'Procesamiento en lote no bloqueante con colas asyncio.',
    code: `import asyncio

async def batch_consumer(queue: asyncio.Queue, batch_size: int = 10):
    batch = []
    while True:
        item = await queue.get()
        batch.append(item)
        if len(batch) >= batch_size:
            await process_batch(batch)
            batch.clear()`
  },

  // ================= JAVA =================
  {
    id: 'java-jun-1',
    language: 'java',
    level: 'junior',
    title: 'Clases y POO Clásica',
    description: 'Estructura orientada a objetos con encapsulamiento.',
    code: `public class Camper {
    private String name;
    private int score;

    public Camper(String name, int score) {
        this.name = name;
        this.score = score;
    }

    public boolean isApproved() {
        return this.score >= 70;
    }
}`
  },
  {
    id: 'java-mid-1',
    language: 'java',
    level: 'mid',
    title: 'Java Streams & Lambdas',
    description: 'Filtrado y transformación reactiva de colecciones.',
    code: `List<Camper> ranking = campers.stream()
    .filter(c -> c.getScore() > 80)
    .sorted(Comparator.comparingInt(Camper::getScore).reversed())
    .limit(10)
    .collect(Collectors.toList());`
  },
  {
    id: 'java-sen-1',
    language: 'java',
    level: 'senior',
    title: 'CompletableFuture y Concurrencia',
    description: 'Composición de tareas asíncronas no bloqueantes.',
    code: `public CompletableFuture<DashboardData> loadDashboard(long userId) {
    return CompletableFuture.supplyAsync(() -> userService.find(userId))
        .thenCompose(user -> statsService.fetchStats(user.getId())
            .thenApply(stats -> new DashboardData(user, stats)))
        .exceptionally(ex -> DashboardData.fallback());
}`
  },

  // ================= C# =================
  {
    id: 'cs-jun-1',
    language: 'csharp',
    level: 'junior',
    title: 'Records y Pattern Matching',
    description: 'Modelado conciso de datos en C# moderno.',
    code: `public record CamperScore(string Username, int Wpm, double Accuracy);

public static string Evaluate(CamperScore score) => score switch {
    { Wpm: >= 90, Accuracy: >= 98 } => "Nivel Legendario",
    { Wpm: >= 60 } => "Nivel Avanzado",
    _ => "En Entrenamiento"
};`
  },
  {
    id: 'cs-mid-1',
    language: 'csharp',
    level: 'mid',
    title: 'LINQ y Métodos de Extensión',
    description: 'Consultas expresivas con tipado seguro en C#.',
    code: `public static IEnumerable<CamperSummary> GetTopPerformers(
    this IEnumerable<Camper> campers, int minWpm) {
    return campers
        .Where(c => c.Stats.AverageWpm >= minWpm)
        .OrderByDescending(c => c.Stats.Accuracy)
        .Select(c => new CamperSummary(c.Id, c.Name, c.Stats.AverageWpm));
}`
  },
  {
    id: 'cs-sen-1',
    language: 'csharp',
    level: 'senior',
    title: 'Channel y Producer-Consumer Asíncrono',
    description: 'Pipeline de alto rendimiento con System.Threading.Channels.',
    code: `public async Task ProduceMetricsAsync(ChannelWriter<MetricEvent> writer) {
    while (await _timer.WaitForNextTickAsync()) {
        var metric = new MetricEvent(DateTime.UtcNow, GetCpuUsage());
        if (!writer.TryWrite(metric)) {
            await writer.WriteAsync(metric);
        }
    }
}`
  },

  // ================= PHP =================
  {
    id: 'php-jun-1',
    language: 'php',
    level: 'junior',
    title: 'Arreglos Asociativos y Funciones',
    description: 'Manejo de registros de estudiantes en PHP 8+.',
    code: `function calcularPromedio(array $calificaciones): float {
    if (empty($calificaciones)) return 0.0;
    $suma = array_sum($calificaciones);
    return round($suma / count($calificaciones), 2);
}

$alumno = ['nombre' => 'Andres', 'notas' => [88, 92, 79]];
echo "Promedio: " . calcularPromedio($alumno['notas']);`
  },
  {
    id: 'php-mid-1',
    language: 'php',
    level: 'mid',
    title: 'Clases con Tipado Estricto y Enums',
    description: 'Programación orientada a objetos con características de PHP 8.2.',
    code: `enum CampusCity: string {
    case Bucaramanga = 'BGA';
    case Medellin = 'MDE';
    case Guatemala = 'GUA';
}

final readonly class CamperEntity {
    public function __construct(
        public string $id,
        public string $name,
        public CampusCity $campus,
        public int $wpm
    ) {}
}`
  },
  {
    id: 'php-sen-1',
    language: 'php',
    level: 'senior',
    title: 'Inyección de Dependencias y Middleware PSR-15',
    description: 'Diseño de middleware HTTP siguiendo estándares modernos.',
    code: `public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface {
    $token = $request->getHeaderLine('X-Camper-Token');
    if (!$this->authenticator->validate($token)) {
        return new JsonResponse(['error' => 'Unauthorized'], 401);
    }
    return $handler->handle($request);
}`
  },

  // ================= GO (GOLANG) =================
  {
    id: 'go-jun-1',
    language: 'go',
    level: 'junior',
    title: 'Structs y Slices en Go',
    description: 'Estructuras limpias y formateo básico en Golang.',
    code: `package main

import "fmt"

type Camper struct {
    Username string
    WPM      int
}

func main() {
    campers := []Camper{
        {"kevin_dev", 74},
        {"laura_go", 92},
    }
    for _, c := range campers {
        fmt.Printf("%s logró %d WPM\\n", c.Username, c.WPM)
    }
}`
  },
  {
    id: 'go-mid-1',
    language: 'go',
    level: 'mid',
    title: 'Goroutines y Channels con Select',
    description: 'Concurrencia nativa segura con canales en Go.',
    code: `func listenForScores(ch <-chan Score, quit <-chan bool) {
    for {
        select {
        case score := <-ch:
            log.Printf("Nuevo puntaje recibido: %+v", score)
        case <-quit:
            log.Println("Deteniendo listener de puntajes...")
            return
        }
    }
}`
  },
  {
    id: 'go-sen-1',
    language: 'go',
    level: 'senior',
    title: 'Worker Pool Concurrente con Context',
    description: 'Gestión de carga distribuida y cancelación graceful.',
    code: `func startWorkerPool(ctx context.Context, jobs <-chan Job, results chan<- Result, workers int) {
    var wg sync.WaitGroup
    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            for job := range jobs {
                select {
                case <-ctx.Done():
                    return
                default:
                    results <- job.Execute()
                }
            }
        }(i)
    }
    wg.Wait()
}`
  },

  // ================= RUST =================
  {
    id: 'rust-jun-1',
    language: 'rust',
    level: 'junior',
    title: 'Ownership y Pattern Matching',
    description: 'Gestión segura de memoria y enums en Rust.',
    code: `#[derive(Debug)]
struct Camper {
    username: String,
    wpm: u32,
}

fn evaluate(camper: &Camper) -> &str {
    match camper.wpm {
        0..=40 => "Iniciando Aceleración",
        41..=80 => "Velocidad Óptima",
        _ => "Nivel Astronauta",
    }
}`
  },
  {
    id: 'rust-mid-1',
    language: 'rust',
    level: 'mid',
    title: 'Result, Option y Operador ?',
    description: 'Control robusto de errores sin excepciones.',
    code: `use std::fs::File;
use std::io::{self, Read};

fn read_camper_config(path: &str) -> Result<String, io::Error> {
    let mut file = File::open(path)?;
    let mut content = String::new();
    file.read_to_string(&mut content)?;
    Ok(content)
}`
  },
  {
    id: 'rust-sen-1',
    language: 'rust',
    level: 'senior',
    title: 'Traits, Lifetimes y Zero-Cost Abstractions',
    description: 'Tipado estricto con garantías de concurrencia Send + Sync.',
    code: `pub trait LeaderboardStore: Send + Sync {
    type Error;
    fn record_score<'a>(&'a self, score: &'a Score) -> Pin<Box<dyn Future<Output = Result<(), Self::Error>> + Send + 'a>>;
}`
  },

  // ================= SQL =================
  {
    id: 'sql-jun-1',
    language: 'sql',
    level: 'junior',
    title: 'Consultas Select, Filtros y Ordenamiento',
    description: 'Extracción de campers aprobados en orden descendente.',
    code: `SELECT 
    username,
    average_wpm,
    total_tests_completed
FROM campers
WHERE average_wpm >= 65 AND is_active = TRUE
ORDER BY average_wpm DESC
LIMIT 10;`
  },
  {
    id: 'sql-mid-1',
    language: 'sql',
    level: 'mid',
    title: 'Joins y Funciones de Agregación',
    description: 'Cálculo de estadísticas por sede y campus con Group By.',
    code: `SELECT 
    c.campus_name,
    COUNT(s.id) AS total_pruebas,
    ROUND(AVG(s.wpm), 2) AS wpm_promedio,
    MAX(s.wpm) AS record_wpm
FROM campus_branches c
JOIN campers u ON u.branch_id = c.id
JOIN scores s ON s.camper_id = u.id
GROUP BY c.campus_name
HAVING COUNT(s.id) >= 50
ORDER BY wpm_promedio DESC;`
  },
  {
    id: 'sql-sen-1',
    language: 'sql',
    level: 'senior',
    title: 'Window Functions (DENSE_RANK) y CTEs',
    description: 'Ranking dinámico particionado por lenguaje de programación.',
    code: `WITH RankedScores AS (
    SELECT 
        github_username,
        language,
        wpm,
        accuracy,
        DENSE_RANK() OVER (
            PARTITION BY language 
            ORDER BY wpm DESC, accuracy DESC
        ) AS ranking_pos
    FROM game_scores
    WHERE created_at >= NOW() - INTERVAL '30 days'
)
SELECT * FROM RankedScores WHERE ranking_pos <= 3;`
  },

  // ================= HTML & CSS =================
  {
    id: 'html-jun-1',
    language: 'html_css',
    level: 'junior',
    title: 'HTML Semántico y Clases Flexbox',
    description: 'Estructuración semántica de tarjetas de usuario.',
    code: `<article class="camper-card">
  <header class="card-header">
    <img src="/avatars/camper.svg" alt="Avatar" class="avatar-img" />
    <h3 class="camper-title">Valentina Ruiz</h3>
  </header>
  <div class="stats-row">
    <span class="badge wpm">84 WPM</span>
    <span class="badge acc">99% Acc</span>
  </div>
</article>`
  },
  {
    id: 'html-mid-1',
    language: 'html_css',
    level: 'mid',
    title: 'CSS Grid y Variables Personalizadas',
    description: 'Diseño responsivo con CSS variables e iluminación sutil.',
    code: `.leaderboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  --glow-color: rgba(44, 170, 255, 0.4);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px var(--glow-color);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}`
  },
  {
    id: 'html-sen-1',
    language: 'html_css',
    level: 'senior',
    title: 'Keyframes de Animación y Shaders CSS',
    description: 'Efecto de escaneo de terminal y brillo de astronauta.',
    code: `@keyframes cyberScan {
  0% { background-position: 0% 0%; }
  100% { background-position: 0% 200%; }
}

.terminal-scanlines::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%, 
    rgba(0, 0, 0, 0.25) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
}`
  }
];

export const LANGUAGE_METADATA: Record<SupportedLanguage, { label: string; icon: string; color: string }> = {
  javascript: { label: 'JavaScript', icon: '⚡', color: '#F7DF1E' },
  typescript: { label: 'TypeScript', icon: '🔷', color: '#3178C6' },
  python: { label: 'Python', icon: '🐍', color: '#3776AB' },
  java: { label: 'Java', icon: '☕', color: '#ED8B00' },
  csharp: { label: 'C#', icon: '🎯', color: '#239120' },
  php: { label: 'PHP', icon: '🐘', color: '#777BB4' },
  go: { label: 'Go (Golang)', icon: '🐹', color: '#00ADD8' },
  rust: { label: 'Rust', icon: '🦀', color: '#DEA584' },
  sql: { label: 'SQL', icon: '🗄️', color: '#00BCF2' },
  html_css: { label: 'HTML / CSS', icon: '🎨', color: '#E34F26' },
};

export const LEVEL_METADATA: Record<CamperLevel, { label: string; badge: string; description: string }> = {
  junior: { label: 'Camper Padawan (Junior)', badge: '🚀 Nivel 1', description: 'Sintaxis básica, bucles y lógica inicial' },
  mid: { label: 'Camper Explorer (Mid)', badge: '🛸 Nivel 2', description: 'Async/await, tipado, métodos funcionales' },
  senior: { label: 'Astronaut Hacker (Senior)', badge: '🌌 Nivel 3', description: 'Algoritmos, concurrencia y patrones' },
};

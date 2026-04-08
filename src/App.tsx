import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import { useMetrics } from './hooks/useMetrics';
import { useScores } from './hooks/useScores';
import { useNotes } from './hooks/useNotes';

function AppRoutes() {
  const { data, metrics, addMetric, updateMetric, deleteMetric, persist, reset } = useMetrics();
  const { setScore, getScore } = useScores(data, persist);
  const { getNote, setNote } = useNotes(data, persist);
  const navigate = useNavigate();

  const handleDayClick = (date: string) => {
    navigate('/', { state: { date } });
  };

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <Home metrics={metrics} getScore={getScore} setScore={setScore} getNote={getNote} setNote={setNote} />
          }
        />
        <Route
          path="/calendar"
          element={
            <Calendar metrics={metrics} scores={data.scores} notes={data.notes} onDayClick={handleDayClick} />
          }
        />
        <Route
          path="/stats"
          element={<Stats metrics={metrics} scores={data.scores} />}
        />
        <Route
          path="/settings"
          element={
            <Settings
              metrics={metrics}
              onAdd={addMetric}
              onUpdate={updateMetric}
              onDelete={deleteMetric}
              onImport={persist}
              onReset={reset}
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}

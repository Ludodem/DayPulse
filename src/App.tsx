import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import { useMetrics } from './hooks/useMetrics';
import { useScores } from './hooks/useScores';

export default function App() {
  const { data, metrics, addMetric, updateMetric, deleteMetric, persist } = useMetrics();
  const { setScore, getScore } = useScores(data, persist);

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <Home metrics={metrics} getScore={getScore} setScore={setScore} />
            }
          />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/stats" element={<Stats />} />
          <Route
            path="/settings"
            element={
              <Settings
                metrics={metrics}
                onAdd={addMetric}
                onUpdate={updateMetric}
                onDelete={deleteMetric}
              />
            }
          />
        </Route>
      </Routes>
    </HashRouter>
  );
}

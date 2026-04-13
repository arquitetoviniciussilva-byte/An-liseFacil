"use client";

import { Card, Button } from "@/components/ui/card";

const Analytics = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-3xl bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center">Análises</h1>
        <p className="text-center text-gray-600 mt-4">
          Aqui você pode ver gráficos e métricas detalhadas sobre o desempenho do seu
          aplicativo. Use os filtros para personalizar a visualização.
        </p>
        <Button className="mt-6 w-full">Exportar Dados</Button>
      </div>
    </div>
  );
};

export default Analytics;
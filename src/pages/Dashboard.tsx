"use client";

import { useState } from "react";
import { Card, Button, Stack } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-3xl bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center">Dashboard</h1>
        <p className="text-center text-gray-600 mt-4">
          Bem-vindo ao seu painel de controle. Aqui você pode acessar
          <Link href="/analytics" className="text-blue-600 hover:underline">análises</Link> e
          <Link href="/profile" className="text-blue-600 hover:underline">perfil</Link>.
        </p>
        <Button className="mt-6 w-full">Botão de Ação</Button>
      </div>
    </div>
  );
};

export default Dashboard;
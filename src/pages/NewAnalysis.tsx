import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "@/utils/toast";

const NewAnalysis = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("Análise cadastrada com sucesso!");
    navigate("/analises");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Dados do Processo */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Informações do Processo</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="process">Número do Processo</Label>
                  <Input id="process" placeholder="Ex: 2024/00000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protocol">Número do Protocolo</Label>
                  <Input id="protocol" placeholder="Ex: PROT-00000" required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="type">Tipo de Solicitação</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alvara_construcao">Alvará de Construção</SelectItem>
                      <SelectItem value="reforma">Reforma com Ampliação</SelectItem>
                      <SelectItem value="habite_se">Habite-se</SelectItem>
                      <SelectItem value="demolicao">Demolição</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Dados do Requerente */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Dados do Requerente e Técnico</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="requester">Nome do Requerente</Label>
                  <Input id="requester" placeholder="Nome completo ou Razão Social" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc">CPF / CNPJ</Label>
                  <Input id="doc" placeholder="000.000.000-00" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tech">Responsável Técnico</Label>
                  <Input id="tech" placeholder="Nome do Engenheiro/Arquiteto" required />
                </div>
              </CardContent>
            </Card>

            {/* Localização */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Localização do Imóvel</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Input id="address" placeholder="Rua, número, bairro" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="realestate">Cadastro Imobiliário</Label>
                  <Input id="realestate" placeholder="00.00.000.0000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zoning">Zoneamento</Label>
                  <Input id="zoning" placeholder="Ex: ZR-1" required />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Configurações da Análise */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Gestão Interna</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="analyst">Analista Responsável</Label>
                  <Select defaultValue="1">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o analista" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Ricardo Oliveira</SelectItem>
                      <SelectItem value="2">Fernanda Lima</SelectItem>
                      <SelectItem value="3">Marcos Souza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status Inicial</Label>
                  <Select defaultValue="em_andamento">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="pendencia_documental">Pendência Documental</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="obs">Observações Internas</Label>
                  <Textarea id="obs" placeholder="Notas sobre o processo..." className="min-h-[120px]" />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 h-11">
                Salvar Análise
              </Button>
              <Button type="button" variant="outline" className="w-full h-11" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewAnalysis;
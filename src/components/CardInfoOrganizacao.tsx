import { Organizacao } from "@/models/organizacao"
import { formatCEP, formatCNPJ, formatPhoneNumber } from "@/utils/formatters"

const CardInfoOrganizacao = ({organizacaoData} : {organizacaoData: Organizacao}) => {
  return (
    <div className="sticky top-6 sm-max:w-full">
        <div className="rounded-lg border bg-[#f7fafc] text-gray-900 shadow-sm">
          <div className="p-6">
            <h3 className="text-xl font-medium mb-4 font-main">Informações da Organização</h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-bold font-tertiary">Nome</p>
                <p className="text-gray-600 font-tertiary">{organizacaoData.nome}</p>
              </div>

              <div>
                <p className="text-sm font-bold font-tertiary">CNPJ</p>
                <p className="text-gray-600 font-tertiary">{formatCNPJ(organizacaoData.cnpj)}</p>
              </div>

              <div>
                <p className="text-sm font-bold font-tertiary">Email</p>
                <p className="text-gray-600 font-tertiary">{organizacaoData.email}</p>
              </div>

              <div>
                <p className="text-sm font-bold font-tertiary">Telefone</p>
                <p className="text-gray-600 font-tertiary">{formatPhoneNumber(organizacaoData.numero)}</p>
              </div>

              <div>
                <p className="text-sm font-bold font-tertiary">Endereço</p>
                <p className="text-gray-600 font-tertiary">{organizacaoData.endereco.rua}, {organizacaoData.endereco.numero}</p>
                <p className="text-gray-600 font-tertiary">{organizacaoData.endereco.cidade} - {organizacaoData.endereco.estado}</p>
                <p className="text-gray-600 font-tertiary"><span className="text-[14px] font-bold font-tertiary text-gray-800">CEP:</span> {formatCEP(organizacaoData.endereco.cep)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default CardInfoOrganizacao

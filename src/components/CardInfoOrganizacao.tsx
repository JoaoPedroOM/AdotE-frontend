const CardInfoOrganizacao = () => {
  return (
    <div className="sticky top-6 sm-max:w-full">
        <div className="rounded-lg border bg-[#f7fafc] text-gray-900 shadow-sm">
          <div className="p-6">
            <h3 className="text-xl font-medium mb-4 font-main">Informações da Organização</h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-bold font-tertiary">Nome</p>
                <p className="text-gray-600 font-tertiary">Instituto Patas Dadas</p>
              </div>

              <div>
                <p className="text-sm font-bold font-tertiary">CNPJ</p>
                <p className="text-gray-600 font-tertiary">1232313123123123131</p>
              </div>

              <div>
                <p className="text-sm font-bold font-tertiary">Email</p>
                <p className="text-gray-600 font-tertiary">joaopedro@hotmail.com</p>
              </div>

              <div>
                <p className="text-sm font-bold font-tertiary">Telefone</p>
                <p className="text-gray-600 font-tertiary">(13) 996983568</p>
              </div>

              <div>
                <p className="text-sm font-bold font-tertiary">Endereço</p>
                <p className="text-gray-600 font-tertiary">Rua Bela, 55</p>
                <p className="text-gray-600 font-tertiary">Peruíbe - São Paulo</p>
                <p className="text-gray-600 font-tertiary"><span className="text-sm font-bold font-tertiary text-gray-800">CEP:</span> 11750-000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default CardInfoOrganizacao

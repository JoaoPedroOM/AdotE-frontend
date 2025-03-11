import { useParams } from "react-router-dom"

const OrganizacaoDetails = () => {
 const {id} = useParams()

  return (
    <div>
      <p>Detalhes da organização de ID: {id}</p>
    </div>
  )
}

export default OrganizacaoDetails

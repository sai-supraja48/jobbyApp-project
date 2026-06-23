import {Link} from 'react-router-dom'

const JobItem = props => {
  const {details} = props

  const {
    id,
    title,
    rating,
    location,
    employment_type: employmentType,
    job_description: jobDescription,
    company_logo_url: companyLogoUrl,
  } = details

  return (
    <Link to={`/jobs/${id}`}>
      <li>
        <img src={companyLogoUrl} alt="company logo" />

        <h1>{title}</h1>

        <p>{rating}</p>

        <p>{location}</p>

        <p>{employmentType}</p>

        <h1>Description</h1>

        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem

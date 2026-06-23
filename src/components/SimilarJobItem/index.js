import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const SimilarJobItem = props => {
  const {jobDetails} = props

  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails

  return (
    <li className="similar-job-card">
      <div className="similar-job-header">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="similar-company-logo"
        />

        <div>
          <h1 className="similar-job-title">{title}</h1>

          <div className="rating-container">
            <BsStarFill className="star-icon" />
            <p className="rating">{rating}</p>
          </div>
        </div>
      </div>

      <h1 className="description-heading">Description</h1>

      <p className="job-description">{jobDescription}</p>

      <div className="job-location-container">
        <div className="location-container">
          <MdLocationOn className="location-icon" />
          <p>{location}</p>
        </div>

        <div className="employment-container">
          <BsBriefcaseFill className="location-icon" />
          <p>{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobItem

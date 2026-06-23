import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    isLoading: true,
    isFailure: false,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const {match} = this.props
    const {id} = match.params

    const token = Cookies.get('jwt_token')

    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, {
      headers: {Authorization: `Bearer ${token}`},
    })

    if (response.ok) {
      const data = await response.json()

      const updatedJobDetails = {
        id: data.job_details.id,
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,

        skills: data.job_details.skills.map(skill => ({
          name: skill.name,
          imageUrl: skill.image_url,
        })),

        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
      }

      const updatedSimilarJobs = data.similar_jobs.map(job => ({
        id: job.id,
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        jobDescription: job.job_description,
        location: job.location,
        rating: job.rating,
        title: job.title,
      }))

      this.setState({
        jobDetails: updatedJobDetails,
        similarJobs: updatedSimilarJobs,
        isLoading: false,
      })
    } else {
      this.setState({isFailure: true, isLoading: false})
    }
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />

      <h1>Oops! Something Went Wrong</h1>

      <p>We cannot seem to find the page you are looking for</p>

      <button type="button" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  render() {
    const {jobDetails, similarJobs, isLoading, isFailure} = this.state

    if (isLoading) {
      return (
        <div data-testid="loader">
          <Loader type="ThreeDots" height="50" width="50" />
        </div>
      )
    }

    if (isFailure) {
      return this.renderFailureView()
    }

    const {
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      companyWebsiteUrl,
      skills,
      lifeAtCompany,
    } = jobDetails

    return (
      <>
        <Header />

        <img src={companyLogoUrl} alt="job details company logo" />

        <h1>{title}</h1>

        <p>{rating}</p>
        <p>{location}</p>
        <p>{employmentType}</p>
        <p>{packagePerAnnum}</p>

        <h1>Description</h1>
        <h2>Description</h2>
        <h3>Description</h3>
        <h4>Description</h4>

        <a href={companyWebsiteUrl}>Visit</a>

        <p>{jobDescription}</p>

        <h1>Skills</h1>

        <ul>
          {skills.map(skill => (
            <li key={skill.name}>
              <img src={skill.imageUrl} alt={skill.name} />
            </li>
          ))}
        </ul>

        <h1>Life at Company</h1>

        <p>{lifeAtCompany.description}</p>

        <img src={lifeAtCompany.imageUrl} alt="life at company" />

        <h1>Similar Jobs</h1>

        <ul>
          {similarJobs.map(job => (
            <li key={job.id}>
              <img src={job.companyLogoUrl} alt="similar job company logo" />
              <h1>{job.title}</h1>
              <p>{job.rating}</p>
              <p>{job.location}</p>
              <p>{job.employmentType}</p>
              <p>{job.jobDescription}</p>
            </li>
          ))}
        </ul>
      </>
    )
  }
}

export default JobItemDetails

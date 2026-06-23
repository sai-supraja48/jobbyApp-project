import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobItem from '../JobItem'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const locationsList = [
  {locationId: 'Hyderabad', label: 'Hyderabad'},
  {locationId: 'Bangalore', label: 'Bangalore'},
  {locationId: 'Chennai', label: 'Chennai'},
  {locationId: 'Delhi', label: 'Delhi'},
  {locationId: 'Mumbai', label: 'Mumbai'},
]

class Jobs extends Component {
  state = {
    profile: {},
    jobsList: [],
    searchInput: '',
    employmentTypes: [],
    salaryRange: '',
    locations: [],
    isLoading: true,
    isFailure: false,
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    const token = Cookies.get('jwt_token')

    const response = await fetch('https://apis.ccbp.in/profile', {
      headers: {Authorization: `Bearer ${token}`},
    })

    if (response.ok) {
      const data = await response.json()

      const updatedProfile = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({profile: updatedProfile})
    } else {
      this.setState({isFailure: true})
    }
  }

  getJobs = async () => {
    const {employmentTypes, salaryRange, searchInput} = this.state

    const token = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypes.join(
      ',',
    )}&minimum_package=${salaryRange}&search=${searchInput}`

    const response = await fetch(url, {
      headers: {Authorization: `Bearer ${token}`},
    })

    if (response.ok) {
      const data = await response.json()

      this.setState({
        jobsList: data.jobs,
        isLoading: false,
      })
    } else {
      this.setState({isFailure: true})
    }
  }

  changeSearch = e => {
    this.setState({searchInput: e.target.value})
  }

  searchJobs = () => {
    this.getJobs()
  }

  selectEmployment = id => {
    const {employmentTypes} = this.state

    const updated = employmentTypes.includes(id)
      ? employmentTypes.filter(each => each !== id)
      : [...employmentTypes, id]

    this.setState({employmentTypes: updated}, this.getJobs)
  }

  selectSalary = id => {
    this.setState({salaryRange: id}, this.getJobs)
  }

  selectLocation = id => {
    const {locations} = this.state

    const updatedLocations = locations.includes(id)
      ? locations.filter(each => each !== id)
      : [...locations, id]

    this.setState({locations: updatedLocations}, this.getJobs)
  }

  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />

      <h1>Oops! Something Went Wrong</h1>

      <p>We cannot seem to find the page you are looking for</p>

      <button type="button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderNoJobs = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />

      <h1>No Jobs Found</h1>

      <p>We could not find any jobs. Try other filters.</p>
    </div>
  )

  render() {
    const {profile, jobsList, isLoading, isFailure} = this.state

    let jobsView

    if (isLoading) {
      jobsView = (
        <div data-testid="loader">
          <Loader type="ThreeDots" height="50" width="50" />
        </div>
      )
    } else if (isFailure) {
      jobsView = this.renderFailure()
    } else if (jobsList.length === 0) {
      jobsView = this.renderNoJobs()
    } else {
      jobsView = (
        <ul>
          {jobsList.map(job => (
            <JobItem key={job.id} details={job} />
          ))}
        </ul>
      )
    }

    return (
      <>
        <Header />

        <img src={profile.profileImageUrl} alt="profile" />
        <h1>{profile.name}</h1>
        <p>{profile.shortBio}</p>
        {/* EMPLOYMENT TYPES */}
        <h1>Type of Employment</h1>
        <ul>
          {employmentTypesList.map(each => (
            <li key={each.employmentTypeId}>
              <input
                type="checkbox"
                id={each.employmentTypeId}
                onChange={() => this.selectEmployment(each.employmentTypeId)}
              />

              <label htmlFor={each.employmentTypeId}>{each.label}</label>
            </li>
          ))}
        </ul>
        {/* SALARY RANGE */}
        <h1>Salary Range</h1>
        <ul>
          {salaryRangesList.map(each => (
            <li key={each.salaryRangeId}>
              <input
                type="radio"
                name="salary"
                id={each.salaryRangeId}
                onChange={() => this.selectSalary(each.salaryRangeId)}
              />

              <label htmlFor={each.salaryRangeId}>{each.label}</label>
            </li>
          ))}
        </ul>
        {/* LOCATIONS */}

        <h1>Locations</h1>

        <ul>
          {locationsList.map(each => (
            <li key={each.locationId}>
              <input
                type="checkbox"
                id={each.locationId}
                onChange={() => this.selectLocation(each.locationId)}
              />

              <label htmlFor={each.locationId}>{each.label}</label>
            </li>
          ))}
        </ul>
        {/* SEARCH */}
        <input
          type="search"
          placeholder="Search"
          onChange={this.changeSearch}
        />
        <button
          type="button"
          data-testid="searchButton"
          onClick={this.searchJobs}
        >
          Search
        </button>
        {jobsView}
      </>
    )
  }
}

export default Jobs

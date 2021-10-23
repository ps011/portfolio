import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image'
import s from './about.module.scss';

const About = ({
  name, about, imageUrl, location, designation, experience, education, skills, stats, profiles,
}) => {
  const aboutTabContent = useRef(null);
  const skillsTabContent = useRef(null);
  const experienceTabContent = useRef(null);
  const aboutTab = useRef(null);
  const skillsTab = useRef(null);
  const experienceTab = useRef(null);
  const aboutRef = useRef(null);

  useEffect(() => {
    aboutRef.current.innerHTML = about
  }, [about])
  const activateTab = (contentRef, tabRef?) => {
    aboutTabContent.current.classList.remove('active')
    skillsTabContent.current.classList.remove('active')
    experienceTabContent.current.classList.remove('active')
    aboutTab.current.classList.remove('active')
    skillsTab.current.classList.remove('active')
    experienceTab.current.classList.remove('active')
    contentRef.current.classList.add('active')
    tabRef.current.classList.add('active')
  }
  return (
    <main className="profile-page" id="about">
      <section className={`${s['section-profile-cover']} section-shaped my-0`} />
      <section className="section">
        <div className="container">
          <div className="card card-profile shadow mt--300">
            <div className="px-4">
              <div className="row justify-content-center">
                <div className="col-lg-3 order-lg-2">
                  <div className="card-profile-image">
                    <a href="/">
                      <img
                        src={imageUrl}
                        className="rounded-circle"
                        alt="dp"
                      />
                    </a>
                  </div>
                </div>
                <div className="col-lg-4 order-lg-3 text-lg-right align-self-lg-center">
                  <div className={`${s.actions} card-profile-actions py-4 mt-lg-0`}>
                    {profiles.length && profiles.map((profile) => (
                      <a href={profile.url} key={profile.name} target="_blank" rel="noreferrer" className={`btn btn-${profile.name} btn-sm`}>
                        <i className={`fa fa-${profile.name}`} />
                      </a>
                    ))}
                  </div>
                </div>
                <div className="col-lg-4 order-lg-1">
                  <div className="card-profile-stats d-flex justify-content-center">
                    {stats.length && stats.map((stat) => (
                      <div key={stat.label}>
                        <span className="heading">{stat.count}</span>
                        <span className="description">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-center mt-2">
                <h3>
                  {name}
                </h3>
                <div className="h6 font-weight-300">
                  <i className="fa fa-map-pin mr-2" />
                  {location}
                </div>
                <div className="h6 mt-4">
                  <i className="fa fa-briefcase mr-2" />
                  {designation}
                </div>
                <div>
                  <i className="fa fa-graduation-cap mr-2" />
                  {education}
                </div>
              </div>
              <div className="mt-3 py-3 border-top text-center">
                <div className="row justify-content-center">

                  <div className="col-lg-9">
                    <div className="nav-wrapper">
                      <ul id="tabs-icons-text" role="tablist" className="nav-fill flex-column flex-md-row nav nav-pills">
                        <li className="nav-item">
                          <a
                            aria-selected="false"
                            href="#p"
                            role="tab"
                            className="mb-sm-3 mb-md-0 active nav-link"
                            ref={skillsTab}
                            onClick={() => activateTab(skillsTabContent, skillsTab)}
                          >
                            <i className="ni ni-atom mr-2" />
                            Skills
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            aria-selected="true"
                            href="#pablo"
                            role="tab"
                            className="mb-sm-3 mb-md-0 nav-link"
                            ref={aboutTab}
                            onClick={() => activateTab(aboutTabContent, aboutTab)}
                          >
                            <i className="ni ni-circle-08 mr-2" />
                            About
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            aria-selected="false"
                            href="#pablo"
                            role="tab"
                            className="mb-sm-3 mb-md-0 nav-link"
                            ref={experienceTab}
                            onClick={() => activateTab(experienceTabContent, experienceTab)}
                          >
                            <i className="ni ni-briefcase-24 mr-2" />
                            Experience
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="shadow card">
                      <div className="card-body">
                        <div className="tab-content">
                          <div className="tab-pane active" ref={skillsTabContent}>
                            {
                              skills.length && skills.map((skill) => (
                                <img
                                  height={84}
                                  width={84}
                                  key={skill.logo}
                                  className={`${s['img-fluid']} text-center col-4 col-md-2 m-2`}
                                  src={skill.logo}
                                  alt={skill.name}
                                  lazy="true"
                                />
                              ))
                            }
                          </div>
                          <div className="tab-pane" ref={aboutTabContent} onClick={() => activateTab(aboutTabContent)}>
                            <p className="description" ref={aboutRef}>
                              {about}
                            </p>
                          </div>
                          <div className="tab-pane" ref={experienceTabContent} onClick={() => activateTab(experienceTabContent)}>
                            <main>
                              {experience.length && experience.map((company) => (
                                <div className={`${s.experience} row`} key={company.logo}>
                                  <div className="col-3">
                                    <Image height="60%" width="100%" layout="responsive" src={company.logo} alt="Company Logo" className="img-fluid" />
                                  </div>
                                  <div className="col-9">
                                    <blockquote className="blockquote text-center mb-0">
                                      <h4 className="mb-0">
                                        {company.designation}
                                        {' '}
                                        @
                                        {' '}
                                        {company.company}
                                      </h4>
                                      <p className="text-muted mb-0">
                                        {' '}
                                        <small>
                                          (
                                          {' '}
                                          {company.from}
                                          {' '}
                                          -
                                          {company.to}
                                          {' '}
                                          )
                                        </small>
                                      </p>
                                    </blockquote>
                                    <p className="my-2">
                                      <i className="ni ni-pin-3 mr-2" />
                                      {' '}
                                      {company.location}
                                    </p>
                                    <br />
                                    {company.technologies && company.technologies.map((technology) => <span key={technology} className="badge badge-pill badge-primary mx-1">{technology}</span>)}
                                  </div>
                                </div>
                              ))}
                            </main>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

About.propTypes = {
  about: PropTypes.string,
  skills: PropTypes.arrayOf(PropTypes.object),
  experience: PropTypes.arrayOf(PropTypes.object),
  imageUrl: PropTypes.string,
  name: PropTypes.string,
  location: PropTypes.string,
  designation: PropTypes.string,
  education: PropTypes.string,
  stats: PropTypes.arrayOf(PropTypes.object),
  profiles: PropTypes.arrayOf(PropTypes.object),
}

About.defaultProps = {
  about: undefined,
  skills: [],
  experience: [],
  imageUrl: undefined,
  name: undefined,
  location: undefined,
  designation: undefined,
  education: undefined,
  stats: [],
  profiles: [],
}

export default About

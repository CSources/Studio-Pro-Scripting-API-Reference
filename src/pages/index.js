import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const quickLinks = [
  {
    title: 'Package Structure',
    description: 'Understanding .package file structure, classfactory.xml, metainfo.xml, and deployment.',
    to: '/docs/package_structure/',
  },
  {
    title: 'Script Interface',
    description: 'Script structure, execution phases, and factory registration.',
    to: '/docs/script_interface/',
  },
  {
    title: 'Host',
    description: 'Attributes, GUI, Commands, Engine, File I/O, Services, and more.',
    to: '/docs/host/host_overview/',
  },
  {
    title: 'SDK Files',
    description: 'CCL, Engine, Devices, and HostUtils SDK modules.',
    to: '/docs/sdk/sdk_files/',
  },
  {
    title: 'Context Object',
    description: 'Editor, functions, iterator, parameters, track list, and methods.',
    to: '/docs/context/context_object/',
  },
  {
    title: 'Objects',
    description: 'Track, Channel, Event, Note, Region, Time objects, and more.',
    to: '/docs/objects/event_object/',
  },
  {
    title: 'Skin Reference',
    description: 'skin.xml structure, elements and attributes for custom dialog UIs.',
    to: '/docs/skin/skin_overview/',
  },
  {
    title: 'Scripts',
    description: 'Working sample scripts and tools demonstrating scripting API usage.',
    to: '/docs/scripts/',
  },
];

function HeroSection() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/overview/">
            Browse the Docs
          </Link>
        </div>
      </div>
    </header>
  );
}

function DisclaimerSection() {
  return (
    <section style={{padding: '2rem 0', textAlign: 'center'}}>
      <div className="container">
        <p style={{fontSize: '0.85rem', opacity: 0.7, maxWidth: 600, margin: '0 auto'}}>
          <strong>Disclaimer:</strong> Fender/PreSonus does not provide official public documentation for this API. This reference is entirely community-derived and incomplete. The API is internal and undocumented.
        </p>
      </div>
    </section>
  );
}

function QuickLinksGrid() {
  return (
    <section style={{padding: '3rem 0'}}>
      <div className="container">
        <div className="row">
          {quickLinks.map((link) => (
            <div key={link.title} className="col col--3" style={{marginBottom: '1.5rem'}}>
              <div className="card" style={{height: '100%'}}>
                <div className="card__body">
                  <Heading as="h3">
                    <Link to={link.to} style={{textDecoration: 'none'}}>
                      {link.title}
                    </Link>
                  </Heading>
                  <p>{link.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout description="Community-compiled scripting API reference for Fender Studio Pro / PreSonus Studio One">
      <HeroSection />
      <main>
        <QuickLinksGrid />
        <DisclaimerSection />
      </main>
    </Layout>
  );
}

import { Observable } from 'rxjs';
import { dateTime } from '@grafana/data';
import { FeedTypeValue } from '../constants';
import { Api } from './api';

/**
 * Response
 *
 * @param response
 */
const getResponse = (response: any) =>
  new Observable((subscriber) => {
    subscriber.next(response);
    subscriber.complete();
  });

/**
 * Time Range
 */
const range = { from: dateTime(), to: dateTime(), raw: { from: '', to: '' } };
const range2000 = { from: dateTime('2000-01-01T00:00:00'), to: dateTime(), raw: { from: '', to: '' } };

/**
 * XML
 */
const xmlResponse = {
  status: 200,
  statusText: 'OK',
  ok: true,
  data: '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Grafana Labs Blog on Grafana Labs</title><link>https://grafana.com/blog/</link><description>Recent content in Grafana Labs Blog on Grafana Labs</description><generator>Hugo -- gohugo.io</generator><language>en-us</language><atom:link href="/blog/index.xml" rel="self" type="application/rss+xml"/><item><title>How product teams can manage their performance using Grafana, Prometheus, and Oracle metrics</title><meta property="og:image" content="https://grafana.com/static/assets/img/blog/obscondelldashboard.jpg"/><link>https://grafana.com/blog/2021/12/23/how-product-teams-can-manage-their-performance-using-grafana-prometheus-and-oracle-metrics/?utm_source=grafana_news&amp;utm_medium=rss</link><pubDate>Thu, 23 Dec 2021 00:00:00 +0000</pubDate><guid isPermaLink="false">https://grafana.com/blog/2021/12/23/how-product-teams-can-manage-their-performance-using-grafana-prometheus-and-oracle-metrics/?utm_source=grafana_news&amp;utm_medium=rss&amp;src=in-prod&amp;plcmt=rss</guid><description>Ever known a project manager who thinks a task takes minutes when it really takes hours? One company has developed a helpful monitoring tool that not only helps project managers make more realistic estimates, but also helps product teams save time, increase efficiency, and improve their overall performance.\nAt ObservabilityCON 2020, Walter Ritzel Paixão Côrtes, a product designer at Dell, gave a presentation about a data-driven solution his team developed called Product Team Observability.</description></item><item><content:encoded><![CDATA[<h4>We discussed the benefits of using Docker containers and initial Provisioning in the recent article on creating our panel plugin template for Grafana. While working on the current feature request for the Base64 image/PDF panel, this technique helped us quickly deliver solutions and improve the long-term support for the panel.</h4><p>When we created a Base64 image/PDF panel to display images for one of our projects, support for PDF documents was added as a feature. I am glad the panel is being used to display PDF documents stored in the databases like PostgreSQL.</p><figure><img alt="" src="https://cdn-images-1.medium.com/max/1024/0*ZhXFfccuxa1PugIM" /></figure>]]></content:encoded><link>https://volkovlabs.com/using-grafana-to-display-large-pdf-documents-weve-got-you-covered-4e654e8d4bce?source=rss----97b04264832a---4</link></item><item><pubDate>123</pubDate><content:encoded><![CDATA[<h4 /><figure />]]></content:encoded></item><image><url>https://cdn-images-1.medium.com/proxy/1*TGH72Nnw24QL3iV9IOm4VA.png</url><title>Volkov Labs - Medium</title><link>https://volkovlabs.com?source=rss----97b04264832a---4</link></image></channel></rss>',
  headers: {},
  url: 'http://localhost:3000/api/datasources/proxy/3/feed',
  type: 'basic',
  redirected: false,
  config: {
    method: 'GET',
    url: 'api/datasources/proxy/3/feed',
    showSuccessAlert: true,
    showErrorAlert: true,
    retry: 0,
    headers: {
      'X-Grafana-Org-Id': 1,
    },
    hideFromInspector: false,
  },
};

/**
 * Fetch request Mock
 */
const fetchRequestMock = jest.fn().mockImplementation(() => getResponse(xmlResponse));

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  getBackendSrv: () => ({
    fetch: fetchRequestMock,
  }),
}));

/**
 * API
 */
describe('Api', () => {
  const instanceSettings: any = {};

  /**
   * Api
   */
  const api = new Api(instanceSettings);

  /**
   * getFeed
   */
  describe('getFeed', () => {
    it('Should make getFeed request for RSS 2.0', async () => {
      let result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.ALL }, range);
      expect(result?.length).toEqual(2);

      result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.ITEMS }, range);
      expect(result?.length).toEqual(1);

      result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.CHANNEL }, range);
      expect(result?.length).toEqual(1);
    });

    it('Should make getFeed request for RSS 2.0 with Time Range', async () => {
      const range = { from: dateTime(), to: dateTime(), raw: { from: '', to: '' } };

      let result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.ALL, dateField: 'pubDate' }, range);
      expect(result?.length).toEqual(2);

      result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.ITEMS }, range);
      expect(result?.length).toEqual(1);

      result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.CHANNEL }, range);
      expect(result?.length).toEqual(1);
    });

    it('Should make getFeed request for Atom', async () => {
      xmlResponse.data =
        '<?xml version="1.0" encoding="UTF-8"?>\n<feed xml:lang="en-US" xmlns="http://www.w3.org/2005/Atom">\n  <id>tag:status.redis.com,2005:/history</id>\n  <link rel="alternate" type="text/html" href="https://status.redis.com"/>\n  <link rel="self" type="application/atom+xml" href="https://status.redis.com/history.atom"/>\n  <title>Redis Status - Incident History</title>\n  <updated>2021-12-26T15:23:56Z</updated>\n  <author>\n    <name>Redis</name>\n  </author>\n  <entry>\n    <id>tag:status.redis.com,2005:Incident/8938651</id>\n    <published>2021-12-26T14:45:23Z</published>\n    <updated>2021-12-26T14:45:23Z</updated>\n    <link rel="alternate" type="text/html" href="https://status.redis.com/incidents/q5bb6tbftgrm"/>\n    <title>Instance failure</title>\n    <content type="html">&lt;p&gt;&lt;small&gt;Dec &lt;var data-var=\'date\'&gt;26&lt;/var&gt;, &lt;var data-var=\'time\'&gt;14:45&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Resolved&lt;/strong&gt; - This incident has been resolved.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Dec &lt;var data-var=\'date\'&gt;26&lt;/var&gt;, &lt;var data-var=\'time\'&gt;14:38&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Investigating&lt;/strong&gt; - We are experiencing instance failure on GCP/us-east1 , this may affect resources that have the following pattern in their endpoint: c16307.us-east1-mz&lt;/p&gt;</content><summary type="html">&lt;p&gt;&lt;small&gt;Dec &lt;var data-var=\'date\'&gt;26&lt;/var&gt;, &lt;var data-var=\'time\'&gt;14:45&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Resolved&lt;/strong&gt; - This incident has been resolved.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Dec &lt;var data-var=\'date\'&gt;26&lt;/var&gt;, &lt;var data-var=\'time\'&gt;14:38&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Investigating&lt;/strong&gt; - We are experiencing instance failure on GCP/us-east1 , this may affect resources that have the following pattern in their endpoint: c16307.us-east1-mz&lt;/p&gt;</summary>\n  </entry>\n  <entry>\n    <id>tag:status.redis.com,2005:Incident/8899527</id>\n    <published>2021-12-21T01:37:14Z</published>\n    <updated>2021-12-21T01:37:14Z</updated>\n    <link rel="alternate" type="text/html" href="https://status.redis.com/incidents/1t2rmcmnp7wd"/>\n    <title>Scheduled Maintenance</title>\n    <content type="html">&lt;p&gt;&lt;small&gt;Dec &lt;var data-var=\'date\'&gt;21&lt;/var&gt;, &lt;var data-var=\'time\'&gt;01:37&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Resolved&lt;/strong&gt; - This incident has been resolved.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Dec &lt;var data-var=\'date\'&gt;21&lt;/var&gt;, &lt;var data-var=\'time\'&gt;01:01&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Monitoring&lt;/strong&gt; - Service maintenance on AWS/us-west-2 applies to all resources with the following pattern in their endpoint : c2638.us-west-2-mz&lt;/p&gt;</content>\n  </entry>\n</feed>\n';

      let result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.ALL }, range);
      expect(result?.length).toEqual(2);

      result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.ITEMS }, range);
      expect(result?.length).toEqual(1);

      result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.CHANNEL }, range);
      expect(result?.length).toEqual(1);
    });

    it('Should make getFeed request for Atom with Time Range', async () => {
      xmlResponse.data =
        '<?xml version="1.0" encoding="UTF-8"?>\n<feed xml:lang="en-US" xmlns="http://www.w3.org/2005/Atom">\n  <id>tag:status.redis.com,2005:/history</id>\n  <link rel="alternate" type="text/html" href="https://status.redis.com"/>\n  <link rel="self" type="application/atom+xml" href="https://status.redis.com/history.atom"/>\n  <title>Redis Status - Incident History</title>\n  <updated>2021-12-26T15:23:56Z</updated>\n  <author>\n    <name>Redis</name>\n  </author>\n  <entry>\n    <id>tag:status.redis.com,2005:Incident/8938651</id>\n    <published>2021-12-26T14:45:23Z</published>\n    <updated>2021-12-26T14:45:23Z</updated>\n    <link rel="alternate" type="text/html" href="https://status.redis.com/incidents/q5bb6tbftgrm"/>\n    <title>Instance failure</title>\n    <content type="html">&lt;p&gt;&lt;small&gt;Dec &lt;var data-var=\'date\'&gt;26&lt;/var&gt;, &lt;var data-var=\'time\'&gt;14:45&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Resolved&lt;/strong&gt; - This incident has been resolved.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Dec &lt;var data-var=\'date\'&gt;26&lt;/var&gt;, &lt;var data-var=\'time\'&gt;14:38&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Investigating&lt;/strong&gt; - We are experiencing instance failure on GCP/us-east1 , this may affect resources that have the following pattern in their endpoint: c16307.us-east1-mz&lt;/p&gt;</content><summary type="html">&lt;p&gt;&lt;small&gt;Dec &lt;var data-var=\'date\'&gt;26&lt;/var&gt;, &lt;var data-var=\'time\'&gt;14:45&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Resolved&lt;/strong&gt; - This incident has been resolved.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Dec &lt;var data-var=\'date\'&gt;26&lt;/var&gt;, &lt;var data-var=\'time\'&gt;14:38&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Investigating&lt;/strong&gt; - We are experiencing instance failure on GCP/us-east1 , this may affect resources that have the following pattern in their endpoint: c16307.us-east1-mz&lt;/p&gt;</summary>\n  </entry>\n  <entry>\n    <id>tag:status.redis.com,2005:Incident/8899527</id>\n    <published>2021-12-21T01:37:14Z</published>\n    <updated>2021-12-21T01:37:14Z</updated>\n    <link rel="alternate" type="text/html" href="https://status.redis.com/incidents/1t2rmcmnp7wd"/>\n    <title>Scheduled Maintenance</title>\n    <content type="html">&lt;p&gt;&lt;small&gt;Dec &lt;var data-var=\'date\'&gt;21&lt;/var&gt;, &lt;var data-var=\'time\'&gt;01:37&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Resolved&lt;/strong&gt; - This incident has been resolved.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Dec &lt;var data-var=\'date\'&gt;21&lt;/var&gt;, &lt;var data-var=\'time\'&gt;01:01&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Monitoring&lt;/strong&gt; - Service maintenance on AWS/us-west-2 applies to all resources with the following pattern in their endpoint : c2638.us-west-2-mz&lt;/p&gt;</content>\n  </entry>\n</feed>\n';

      let result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.ALL, dateField: 'updated' }, range2000);
      expect(result?.length).toEqual(2);

      result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.ITEMS, dateField: 'updated' }, range);
      expect(result?.length).toEqual(1);

      result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.CHANNEL }, range);
      expect(result?.length).toEqual(1);
    });

    it('Should handle getFeed request with no data', async () => {
      xmlResponse.data = '';
      jest.spyOn(console, 'error').mockImplementation();

      let result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.ALL }, range);
      expect(result?.length).toEqual(0);
    });

    it('Should handle getFeed request for Atom with no data', async () => {
      xmlResponse.data = '<?xml version="1.0" encoding="UTF-8"?>\n\n';

      let result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.ALL });
      expect(result?.length).toEqual(0);
    });

    /**
     * Atom with Title only
     */
    it('Should handle getFeed request for Atom with title only', async () => {
      xmlResponse.data = `<rss version="2.0"
      xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
          <title>Test</title>
      </channel>
      </rss>`;

      let result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.ALL }, range);
      expect(result?.length).toEqual(1);
    });

    /**
     * Atom with image and no Source
     */
    it('Should handle getFeed request for Atom with image and no src', async () => {
      xmlResponse.data = `<rss version="2.0"
      xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
          <item>
              <content:encoded><![CDATA[<h4>Test.</h4><figure><img alt="" src="" /></figure>]]></content:encoded>
          </item>
          <item>
              <content:encoded><![CDATA[<h4 /><figure />]]></content:encoded>
          </item>
      </channel>
      </rss>`;

      let result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.ITEMS }, range);
      expect(result?.length).toEqual(1);
    });

    /**
     * RSS
     */
    it('Should handle getFeed request for RSS 1.0', async () => {
      xmlResponse.data = `<?xml version="1.0" encoding="UTF-8"?>
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
          xmlns="http://purl.org/rss/1.0/"
          xmlns:dc="http://purl.org/dc/elements/1.1/">
          <channel rdf:about="https://web.nvd.nist.gov/view/vuln/search">
              <title>National Vulnerability Database</title>
              <link>https://web.nvd.nist.gov/view/vuln/search</link>
              <description>This feed contains the most recent CVE cyber vulnerabilities published within the National Vulnerability Database.</description>
              <dc:date>2022-04-25T18:00:00Z</dc:date>
              <dc:language>en-us</dc:language>
              <dc:rights>This material is not copywritten and may be freely used, however, attribution is requested.</dc:rights>
          </channel>
          <item rdf:about="https://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2016-20014">
              <title>CVE-2016-20014</title>
              <link>https://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2016-20014</link>
              <description>In pam_tacplus.c in pam_tacplus before 1.4.1, pam_sm_acct_mgmt does not zero out the arep data structure.</description>
              <dc:date>2022-04-21T04:15:09Z</dc:date>
          </item>
      </rdf:RDF>`;

      let result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.ITEMS }, range);
      expect(result?.length).toEqual(1);
      expect(result[0].fields.length).toEqual(5);
    });

    /**
     * GitHub Atom
     */
    it('Should make getFeed request for GitHub Atom', async () => {
      xmlResponse.data = `<?xml version="1.0" encoding="UTF-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xml:lang="en-US">
        <id>tag:github.com,2008:https://github.com/sonatype/nexus-public/releases</id>
        <link type="text/html" rel="alternate" href="https://github.com/sonatype/nexus-public/releases"/>
        <link type="application/atom+xml" rel="self" href="https://github.com/sonatype/nexus-public/releases.atom"/>
        <title>Release notes from nexus-public</title>
        <updated>2022-03-29T22:38:42Z</updated>
        <entry>
          <id>tag:github.com,2008:Repository/40029062/release-3.38.1-01</id>
          <updated>2022-03-30T09:02:42Z</updated>
          <link rel="alternate" type="text/html" href="https://github.com/sonatype/nexus-public/releases/tag/release-3.38.1-01"/>
          <title>3.38.1-01</title>
          <content type="html">&lt;p&gt;&lt;a href=&quot;https://help.sonatype.com/repomanager3/product-information/release-notes/2022-release-notes/nexus-repository-3.38.0---3.38.1-release-notes&quot; rel=&quot;nofollow&quot;&gt;https://help.sonatype.com/repomanager3/product-information/release-notes/2022-release-notes/nexus-repository-3.38.0---3.38.1-release-notes&lt;/a&gt;&lt;/p&gt;</content>
          <author>
            <name>Blacktiger</name>
          </author>
          <media:thumbnail height="30" width="30" url="https://avatars.githubusercontent.com/u/86939?s=60&amp;v=4"/>
        </entry>
      </feed>`;

      let result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.ALL }, range);
      expect(result?.length).toEqual(2);

      result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.ITEMS }, range);
      expect(result?.length).toEqual(1);

      result = await api.getFeed({ refId: 'A', feedType: FeedTypeValue.CHANNEL }, range);
      expect(result?.length).toEqual(1);
    });
  });
});

# CloakScan

**CloakScan** is a browser extension that enhances online safety by identifying potentially unsafe links on a webpage. By leveraging Docker containers for secure, isolated link analysis and ChatGPT for precise link extraction, CloakScan offers real-time threat detection, helping users avoid malicious content while browsing.

---

## Features

- **Browser Extension**: Collects all links on a webpage with a single click, making it easy for users to initiate the safety check.
- **Link Extraction with ChatGPT**: Uses ChatGPT to extract all visible and hidden links from a webpage’s HTML, ensuring thorough link coverage.
- **Docker-based Link Analysis**: Employs Docker containers to analyze each link in an isolated, secure environment, protecting the system from threats.
- **Real-time Feedback**: Provides immediate notifications on the safety status of each link, categorizing them as safe, suspicious, or malicious.

---

## Technology Stack

- **JavaScript**: Powers the browser extension.
- **MongoDB**: Stores link data, analysis results, and logs.
- **ChatGPT API**: Assists in refining and extracting links from the HTML content.
- **Docker**: Provides containerized environments for secure link analysis.
- **AWS or VMware (optional)**: For hosting Docker containers and managing infrastructure.

---

## Project Architecture

1. **User Side (Browser Extension)**:
   - Captures the entire HTML source of a webpage (`document.documentElement.outerHTML`).
   - Sends the HTML to ChatGPT for link extraction.

2. **Server Side (Link Analysis)**:
   - Each link is analyzed in Docker containers to ensure security isolation.
   - MongoDB stores results for future reference, and results are sent back to the extension.

3. **Data Flow**:
   - HTML Source ➔ Link Extraction via ChatGPT ➔ Dockerized Link Analysis ➔ MongoDB Storage ➔ User Feedback

---

## Installation

### Prerequisites

- **MongoDB**: Install MongoDB and set up a database.
- **Docker**: Install Docker for running containerized link analyses.
- **Node.js**: Required for server-side scripts and API setup.
- **ChatGPT API Key**: Obtain an API key from OpenAI to access the ChatGPT API.

### Setup Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/cloakscan.git
   cd cloakscan
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Create a `.env` file and add necessary configurations:
     - `MONGODB_URI`: MongoDB connection string
     - `CHATGPT_API_KEY`: Your OpenAI ChatGPT API key
     - `PORT`: Port for the server (default: 3000)

4. **Run the Server**:
   ```bash
   npm start
   ```

5. **Load the Browser Extension**:
   - Open your browser in developer mode, navigate to `chrome://extensions`, and load the extension from the `extension` folder.

---

## Usage

1. **Activate CloakScan**: Navigate to any webpage and click on the CloakScan icon to initiate link collection.
2. **Link Analysis**: The extension collects links, sends them to the server, and each link is analyzed within Docker containers.
3. **Receive Feedback**: CloakScan displays real-time notifications on the safety of each link (safe, suspicious, or malicious).

---

## API Reference

### 1. **Link Collection API**
   - **Endpoint**: `/collect-links`
   - **Method**: `POST`
   - **Request Body**:
     ```json
     {
       "html_content": "<entire_page_html>"
     }
     ```
   - **Response**:
     ```json
     {
       "status": "success",
       "links": ["https://example.com", "https://anotherlink.com"]
     }
     ```

### 2. **Link Analysis API**
   - **Endpoint**: `/analyze-link`
   - **Method**: `POST`
   - **Request Body**:
     ```json
     {
       "link": "https://example.com"
     }
     ```
   - **Response**:
     ```json
     {
       "status": "safe",
       "details": "No threats detected"
     }
     ```

---

## Database Schema

### Link Collection
```json
{
  "link_id": "unique_id",
  "url": "https://example.com",
  "status": "safe/suspicious/malicious",
  "last_checked": "timestamp"
}
```

### Analysis Logs
```json
{
  "log_id": "unique_id",
  "link_id": "reference_to_link_id",
  "container_id": "docker_container_id",
  "analysis_result": "safe/suspicious/malicious",
  "analysis_details": "Detailed findings of the analysis"
}
```

---

## Security Considerations

- **Docker Isolation**: Each link is analyzed within an isolated Docker container, preventing cross-contamination and protecting the host system.
- **API Rate Limiting**: Rate limiting is implemented to avoid excessive requests to the ChatGPT API and the server.
- **Data Privacy**: MongoDB access is restricted, and all user data is securely handled to prevent unauthorized access.

---

## Maintenance and Updates

- **Docker Updates**: Regularly update Docker containers with the latest security patches and analysis tools.
- **Database Backups**: Ensure MongoDB is regularly backed up to prevent data loss.
- **API Monitoring**: Track API usage to identify performance issues or potential abuse.

---

## Future Enhancements

1. **Real-Time Threat Alerts**: Notify users of high-risk links immediately.
2. **Extended Threat Intelligence**: Integrate additional APIs (e.g., VirusTotal) for comprehensive threat analysis.
3. **User Feedback Loop**: Allow users to report false positives or negatives, helping to improve analysis accuracy.
4. **Caching**: Implement caching to avoid redundant analysis of previously scanned links.

---

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature-branch`).
3. Commit your changes and push to your forked repository.
4. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For questions or support, please contact the project maintainer at [youremail@example.com].

---

**CloakScan** - Keeping your browsing experience safe and secure.

# Competitor Analysis Dashboard

A modern web application for performing in-depth financial comparison between two companies. Built with Next.js, React, and TypeScript, this dashboard provides valuable insights through data visualization and side-by-side financial metrics comparison.

## 🚀 Features

- **Head-to-Head Financial Comparison**: Compare key financial metrics between two companies
- **Interactive Data Visualization**: Clear, interactive charts for financial data comparison
- **Comprehensive Financial Metrics**: Analyze market performance, growth, and other KPIs
- **Responsive Design**: Works seamlessly across all devices
- **Real-time Market Data**: Fetches and displays the most current financial information

## 🛠️ Technology Stack

### Core Technologies
- **Frontend Framework**: [Next.js 15.3.3](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://reactjs.org/)
- **Programming Language**: [TypeScript 5.0+](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.0+](https://tailwindcss.com/)
- **Build Tool**: Turbopack (Next.js default)

### Data Visualization
- **Charts**: [Chart.js 4.4.9](https://www.chartjs.org/) 
- **React Integration**: [React-ChartJS-2 5.3.0](https://react-chartjs-2.js.org/)

### Data Sources & APIs
- **Primary Data Source**: [Yahoo Finance API](https://www.yahoofinanceapi.com/) (via `yahoo-finance2`)
- **Fallback Data Source**: [Google Gemini AI](https://ai.google.dev/)
- **Logo Service**: [Logo.dev API](https://logo.dev/)
- **Currency Conversion**: [ExchangeRate-API](https://www.exchangerate-api.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn package manager
- Environment Variables (create a `.env.local` file):
  ```
  GEMINI_API_KEY=your_gemini_api_key
  EXCHANGERATE_API_KEY=your_exchangerate_api_key
  ```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/competitor-analysis-tool.git
   cd competitor-analysis-tool
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

## 🔄 Data Fetching & Fallback Mechanism

The application implements a multi-layered fallback strategy to ensure maximum data availability:

### 1. Primary Data Source: Yahoo Finance API
- First attempt to fetch complete financial data
- Provides real-time market data and financial metrics
- Used for: Stock prices, financial statements, key statistics

### 2. Fallback to Gemini AI
- **Triggered When**: 
  - Yahoo Finance returns incomplete data
  - Required fields are missing
  - API rate limits are reached
- **Implementation**: 
  - Uses structured prompts to generate missing financial data
  - Maintains consistent data structure with Yahoo Finance
  - Clearly indicates fallback usage in the UI

### 3. Data Normalization
- Handles different currencies using ExchangeRate-API
- Normalizes financial metrics for accurate comparison
- Converts all values to USD for consistent comparison

### 4. Graceful Degradation
- Continues to function with partial data
- Clearly indicates missing or estimated data points
- Maintains UI consistency even with incomplete data

## 📊 How to Use

1. **Enter Company Information**:
   - Type the names or tickers of two companies in the search fields
   - Select from the dropdown suggestions that appear

2. **View Comparison**:
   - The dashboard will display side-by-side comparison of key metrics
   - Metrics are color-coded to highlight better performance

3. **Analyze Data**:
   - Scroll through different categories of financial metrics
   - View interactive charts for visual comparison
   - Hover over data points for detailed information

4. **Understand Data Sources**:
   - Primary data source: Yahoo Finance (indicated by default)
   - Fallback data: Clearly marked with a Gemini AI indicator
   - Estimated values: Clearly labeled when data is approximated

## 🛠 Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Create an optimized production build
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## 🤝 Contributing

Contributions are welcome! Please ensure:
1. Code follows existing TypeScript patterns
2. New features include appropriate type definitions
3. Fallback mechanisms are maintained for new data sources
4. All tests pass before submitting a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

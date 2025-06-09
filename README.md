# Competitor Analysis Dashboard

A modern web application for performing in-depth competitor analysis by comparing key metrics between two companies. Built with Next.js, React, and TypeScript, this dashboard provides valuable insights through data visualization and side-by-side comparisons.

## 🚀 Features

- **Head-to-Head Comparison**: Compare key metrics between two competitors
- **Interactive Visualizations**: Clear, interactive charts for data comparison
- **Financial Metrics**: Analyze market performance, growth, and other KPIs
- **Responsive Design**: Works seamlessly across all devices
- **Real-time Data**: Fetches and displays the most current information

## 🛠️ Technologies Used

- **Frontend Framework**: [Next.js](https://nextjs.org/) with React 19
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Data Visualization**: [Chart.js](https://www.chartjs.org/) with [React-ChartJS-2](https://react-chartjs-2.js.org/)
- **Data Sources**: Various web sources and APIs for competitor data
- **Build Tool**: Turbopack (Next.js default)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn package manager
- Gemini api key
- BrandFetch api key
- Frankfurter api key

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

## 🔄 Fallback Mechanism

The application implements a robust fallback mechanism to ensure data availability:

1. **Primary Data Source**: Yahoo Finance API is used as the main data source
2. **Fallback to Gemini AI**: If data cannot be retrieved from Yahoo Finance, the system automatically falls back to using Gemini AI to generate the required data
3. **Transparent Indicators**: The UI indicates when fallback data is being used
4. **Graceful Degradation**: The application continues to function with partial data if only one company's data is available

## 📊 How to Use

1. Enter the names or tickers of two competing companies in the search fields
2. Select the companies from the dropdown suggestions
3. View the side-by-side comparison of key metrics
4. Use the interactive charts to analyze different aspects of the competition
5. Toggle between different time periods or metrics as needed
6. Look for fallback indicators to know if any data is being served from the backup source

## 🛠 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

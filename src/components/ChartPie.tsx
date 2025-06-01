import { _company_data } from '@/app/page';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";


ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
    data: _company_data
}
function formatValue(value: number) {
    if (value >= 1e12) return (value / 1e12).toFixed(2) + ' (Trillions)';
    if (value >= 1e9) return (value / 1e9).toFixed(2) + ' (Billions)';
    if (value >= 1e6) return (value / 1e6).toFixed(2) + ' (Millions)';
    if (value >= 1e3) return (value / 1e3).toFixed(2) + ' K';
    return value.toFixed(2);
}
const ChartPie = ({ data }: Props) => {

    const raw = {
        marketCap: data?.summaryDetail?.marketCap!,
        revenue: data?.financialData?.totalRevenue!,
        freecashflow: data?.financialData?.freeCashflow!,
        grossProfit: data?.financialData?.grossProfits!,


    }

    const total = raw.marketCap + raw.revenue + raw.freecashflow + raw.grossProfit;

    const percentages = [
        (raw.marketCap / total) * 100,
        (raw.revenue / total) * 100,
        (raw.freecashflow / total) * 100,
        (raw.grossProfit / total) * 100,
    ];
    console.log(percentages)
    const labels = ['Market Cap', 'Revenue', 'Free cashflow ', 'Gross Profit',];
    const chartData = {
        labels: labels,
        datasets: [{
            data: percentages,
            backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0'],
            borderWidth: 1
        }]
    }

    return (
        <div className="max-w-[500px]">
            <Pie style={{ width: "400px", height: "500px" }} data={chartData} options={{
                responsive: true,
                plugins: {
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (context) {
                                const idx = context.dataIndex;
                                return labels[idx].split("(")[0] + ":" + formatValue(Object.values(raw)[idx]);
                            }
                        }
                    },
                    legend: { position: "bottom" }
                }
            }} />

        </div>
    )
}

export default ChartPie
import { Trip } from "../class/Trip/Trip"
import { ExpenseNode } from "../class/Trip/ExpenseNode"

interface LocationData {
    location: string
    expenses: ExpenseNode[]
    total: number
}

interface DateData {
    date: number
    expenses: ExpenseNode[]
    total: number
}

export function generateTripReportEmailHTML(trip: Trip): string {
    // Helper function to format currency
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount)
    }

    // Helper function to format date
    const formatDate = (timestamp: number): string => {
        return new Date(timestamp).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    // Get only active nodes
    const validNodes = trip.nodes.filter(node => node.active)

    // Helper to get location (traverse up to find location)
    const getLocation = (expense: ExpenseNode): string | undefined => {
        if (expense.location) return expense.location

        const parentNode = validNodes.find(node => node.id === expense.parentId)
        if (parentNode) {
            return getLocation(parentNode)
        }

        return undefined
    }

    // Helper to get date (traverse up to find date)
    const getDate = (expense: ExpenseNode): number | undefined => {
        if (expense.datetime) return expense.datetime

        const parentNode = validNodes.find(node => node.id === expense.parentId)
        if (parentNode) {
            return getDate(parentNode)
        }

        return undefined
    }

    // Calculate expense total
    const calculateExpenseTotal = (expense: ExpenseNode): number => {
        if (expense.expense) {
            const amount = Number(expense.expense.amount) || 0
            const quantity = Number((expense.expense.quantity || '1').toString().replace(/\D/g, '')) || 1
            return amount * quantity
        }
        return 0
    }

    // Group expenses by location
    const locationMap = new Map<string, LocationData>()
    validNodes.forEach(node => {
        const location = getLocation(node)
        if (location) {
            const existing = locationMap.get(location) || { location, expenses: [], total: 0 }
            existing.expenses.push(node)
            existing.total += calculateExpenseTotal(node)
            locationMap.set(location, existing)
        }
    })

    const locationData = Array.from(locationMap.values())

    // Group expenses by date
    const dateMap = new Map<number, DateData>()
    validNodes.forEach(node => {
        const datetime = getDate(node)
        if (datetime) {
            const dateKey = new Date(datetime).setHours(0, 0, 0, 0)
            const existing = dateMap.get(dateKey) || { date: dateKey, expenses: [], total: 0 }
            existing.expenses.push(node)
            existing.total += calculateExpenseTotal(node)
            dateMap.set(dateKey, existing)
        }
    })

    const dateData = Array.from(dateMap.values()).sort((a, b) => a.date - b.date)

    // Helper to get children of an expense
    const getChildren = (parentId: string, expenses: ExpenseNode[]): ExpenseNode[] => {
        return expenses.filter(expense => expense.parentId === parentId)
    }

    // Helper to get root expenses (expenses without parents in the list)
    const getRootExpenses = (expenses: ExpenseNode[]): ExpenseNode[] => {
        const expenseIds = new Set(expenses.map(e => e.id))
        return expenses.filter(expense => !expense.parentId || !expenseIds.has(expense.parentId))
    }

    // Recursive function to render expense tree
    const renderExpenseTree = (expense: ExpenseNode, expenses: ExpenseNode[], depth: number = 0): string => {
        const children = getChildren(expense.id, expenses)
        const marginLeft = depth * 20
        const expenseTotal = expense.totalExpenses || calculateExpenseTotal(expense)

        let html = `
            <div style="margin-left: ${marginLeft}px; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 4px 8px;">
                            <span style="font-size: 14px; color: #333;">${expense.description || 'Sem descrição'}</span>
                        </td>
                        <td style="padding: 4px 8px; text-align: right; white-space: nowrap;">
                            <span style="font-size: 14px; color: #333; font-weight: ${depth === 0 ? '600' : '400'};">${formatCurrency(expenseTotal)}</span>
                        </td>
                    </tr>
                </table>
            </div>
        `

        // Render children
        children.forEach(child => {
            html += renderExpenseTree(child, expenses, depth + 1)
        })

        return html
    }

    // Calculate total without location
    const locationsTotal = locationData.reduce((sum, loc) => sum + loc.total, 0)
    const withoutLocationTotal = trip.totalExpenses - locationsTotal

    // Generate HTML
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Viagem - ${trip.name}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
    <div style="max-width: 800px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: 600;">${trip.name}</h1>
            ${trip.description ? `<p style="margin: 0; opacity: 0.9; font-size: 16px;">${trip.description}</p>` : ''}
            ${trip.startDate || trip.endDate ? `
                <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">
                    ${trip.startDate ? formatDate(trip.startDate) : ''} ${trip.startDate && trip.endDate ? '→' : ''} ${trip.endDate ? formatDate(trip.endDate) : ''}
                </p>
            ` : ''}
        </div>

        <!-- Summary -->
        <div style="padding: 20px 30px; border-bottom: 2px solid #e0e0e0;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; font-size: 20px; color: #333;">Total Geral</h2>
                <span style="font-size: 32px; font-weight: 700; color: #667eea;">${formatCurrency(trip.totalExpenses)}</span>
            </div>
        </div>

        <!-- Location Report -->
        <div style="padding: 30px;">
            <h2 style="margin: 0 0 20px 0; font-size: 22px; color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                📍 Relatório por Localização
            </h2>

            ${locationData.map(location => `
                <div style="margin-bottom: 30px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <!-- Location Header -->
                    <div style="background-color: #f8f9fa; padding: 15px 20px; border-bottom: 2px solid #667eea;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 0;">
                                    <h3 style="margin: 0; font-size: 18px; color: #333; font-weight: 600;">${location.location}</h3>
                                </td>
                                <td style="padding: 0; text-align: right;">
                                    <span style="font-size: 20px; font-weight: 700; color: #667eea;">${formatCurrency(location.total)}</span>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <!-- Expenses List -->
                    <div style="padding: 10px 20px;">
                        ${getRootExpenses(location.expenses).map(expense => 
                            renderExpenseTree(expense, location.expenses)
                        ).join('')}
                    </div>
                </div>
            `).join('')}

            ${withoutLocationTotal > 0 ? `
                <div style="margin-bottom: 20px; padding: 15px 20px; background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 8px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 0;">
                                <span style="font-size: 16px; color: #856404;">Sem localização</span>
                            </td>
                            <td style="padding: 0; text-align: right;">
                                <span style="font-size: 18px; font-weight: 600; color: #856404;">${formatCurrency(withoutLocationTotal)}</span>
                            </td>
                        </tr>
                    </table>
                </div>
            ` : ''}
        </div>

        <!-- Date Report -->
        ${dateData.length > 0 ? `
        <div style="padding: 30px; background-color: #f8f9fa;">
            <h2 style="margin: 0 0 20px 0; font-size: 22px; color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                📅 Relatório por Data
            </h2>

            ${dateData.map(dateInfo => `
                <div style="margin-bottom: 20px; background-color: white; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <!-- Date Header -->
                    <div style="background-color: #667eea; color: white; padding: 12px 20px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 0;">
                                    <span style="font-size: 16px; font-weight: 600;">${formatDate(dateInfo.date)}</span>
                                </td>
                                <td style="padding: 0; text-align: right;">
                                    <span style="font-size: 18px; font-weight: 700;">${formatCurrency(dateInfo.total)}</span>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <!-- Expenses for this date -->
                    <div style="padding: 10px 20px;">
                        ${dateInfo.expenses.map(expense => {
                            const expenseTotal = calculateExpenseTotal(expense)
                            return `
                                <div style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 4px 8px;">
                                                <span style="font-size: 14px; color: #333;">${expense.description || 'Sem descrição'}</span>
                                                ${expense.location ? `<br><span style="font-size: 12px; color: #666;">📍 ${expense.location}</span>` : ''}
                                            </td>
                                            <td style="padding: 4px 8px; text-align: right; white-space: nowrap;">
                                                <span style="font-size: 14px; color: #333;">${formatCurrency(expenseTotal)}</span>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            `
                        }).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Footer -->
        <div style="padding: 20px 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center; color: #666; font-size: 12px;">
            <p style="margin: 0;">Relatório gerado em ${formatDate(Date.now())}</p>
            <p style="margin: 5px 0 0 0;">Planika - Gestão de Viagens</p>
        </div>
    </div>
</body>
</html>
    `.trim()
}

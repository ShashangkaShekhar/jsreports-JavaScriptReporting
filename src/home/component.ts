import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DataService } from '../shared/service';

declare var jsreports: any;

@Component({
    selector: 'app-home',
    templateUrl: './app/home/component.html',
    providers: [DataService]
})

export class HomeComponent implements OnInit, AfterViewInit {
    public title: any;
    public transResult: any;

    constructor(
        private titleService: Title,
        private _dataService: DataService) {
    }

    ngOnInit() {
        this.titleService.setTitle("Home- JsReports");
        // this.title = 'Angular8';
    }

    ngAfterViewInit() {
        //this.jsreports();
        this.invoiceReport();
    }

    jsreports()
    {
        var dataSources = [{
            "id": "account_detail",
            "name": "Account Detail",
            "data": [{
                "accountHolder": "John Q. Public",
                "accountNumber": "Z04-20049713",
                "accountValue": 9040.17,
                "freeCredit": 7482.57,
                "startDate": new Date(2015, 11, 1),
                "endDate": new Date(2015, 11, 31),
                "netChange": -194.64,
                "changeItems": [{
                    "category": "Beginning Account Value",
                    "description": "",
                    "currentPeriod": 9234.81,
                    "ytd": 0
                },{
                    "category": "Additions",
                    "description": "Exchanges In",
                    "currentPeriod": 0,
                    "ytd": 10000
                },{
                    "category": "Subtractions",
                    "description": "Transaction Costs & Fees",
                    "currentPeriod": 0,
                    "ytd": -28.54
                },{
                    "category": "Change in Investment Value",
                    "description": "",
                    "currentPeriod": -194.64,
                    "ytd": -931.29
                }],
                "holdings": [{
                    "name": "Core Account",
                    "amount": 7482,
                    "color": "#E0E0E0"
                },{
                    "name": "Stocks",
                    "amount": 1557,
                    "color": "#9CCC65"
                }],
                "incomeItems": [{
                    "category": "Taxable",
                    "description": "Interest",
                    "currentPeriod": 0.06,
                    "ytd": 0.31
                }]
            }]
        }];

        var report = jsreports.createReport('Bank Statement')
            .data('account_detail')
            .page(11, 8.5, 'inches')
            .margins(0.5)
            .header(1.25)
                .image('https://www.jsreports.com/examples/images/magnifibank-logo.png', 0, 0, 2.5, 1)
                .text('Account Summary', 5.25, 0.15, 4.75, 0.2, { 
                    bold: true, align: 'right', fontsize: 13 
                })
                .text('[=FORMAT(startDate, \'mmm d, yyyy\')] to [=FORMAT(endDate, \'mmm d, yyyy\')]', 5.25, 0.4, 4.75, 0.2, { 
                    align: 'right', fontsize: 13 
                })
            .detail(5.5)
                .text('Account Value:', 0, 0, 2.5, 0.5, { fontsize: 15 })
                .text('[accountValue]', 2.5, 0, 2.25, 0.5, { 
                    fontsize: 15, bold: true, pattern: '$#,##0.00', align: 'right' 
                })
                .text('Change in Account Value', 0, 0.75, 2.5, 0.5, { 
                    fontsize: 14, text_color: '#777'
                })
                .text('[netChange]', 2.5, 0.75, 2.25, 0.5, { 
                    fontsize: 14, align: 'right', pattern: '$#,##0.00;($#,##0.00)', 
                    text_color: '#777', bold: true
                })
                .table(0, 1.25, 4.75, 2.5, { data: 'changeItems', hasFooter: true, 
                    groupBy: 'category', fontSize: 9, hideRowWhenExpr: '!description' 
                })
                    .column('50%', '   [description]', '', '', { 
                        align: 'left', group0Header: '[category]' })
                    .column('25%', '[currentPeriod]', 'This Period', '[SUM(currentPeriod)]', { 
                        align: 'right',
                        detailStyle: {
                            pattern: '#,##0.00'
                        },
                        group0Header: '[SUM(currentPeriod)]',
                        group0HeaderStyle: {
                            pattern: '#,##0.00'
                        }
                    })
                    .column('25%', '[ytd]', 'Year-to-Date', '[SUM(ytd)]', { 
                        align: 'right',
                        detailStyle: {
                            pattern: '#,##0.00'
                        },
                        group0Header: '[SUM(ytd)]',
                        group0HeaderStyle: {
                            pattern: '#,##0.00'
                        }
                    })
                .text('Free Credit Balance', 0, 3, 2.25, 0.2, { fontsize: 11 })
                .text('[freeCredit]', 3, 3, 1.75, 0.2, { 
                    align: 'right', pattern: '$#,##0.00', fontsize: 11 
                })
                .text('Account # [accountNumber]', 5.25, 0, 4.75, 0.2, { 
                    bold: true, align: 'right', fontsize: 13 
                })
                .text('[accountHolder] - INDIVIDUAL', 5.25, 0.25, 4.75, 0.2, { 
                    bold: true, align: 'right', fontsize: 13 
                })
                .text('Account Holdings', 5.25, 0.75, 4.75, 0.25, { fontsize: 13 })
                .chart('pie', 5.25, 1, 4.75, 2, { data: "holdings" })
                    .series('amount', 'name', 'color')
                .table(5.25, 3.25, 4.75, 1.5, { data: 'holdings', hasFooter: true, fontSize: 9 })
                    .column('50%', '[name]', 'Holding Type', '', { align: 'left' })
                    .column('25%', '[amount]', 'Value', '[SUM(amount)]', { 
                        align: 'right', 
                        detailStyle: { pattern: '#,##0' },
                        footerStyle: { pattern: '#,##0'
                    } })
                    .column('25%', '[=amount / SUM(\'amount\')]', 'Percent of Account', '100%', { 
                        align: 'right', 
                        detailStyle: { pattern: '0%' }, 
                        footerStyle: { pattern: '0%' } 
                    })
                .text('Please note that due to rounding, percentages may not add to 100%.', 
                    5.25, 4.5, 4.75, 1, { fontsize: 10, wrap: true })
                .text(['Important disclosures: Past results do not guarantee future',
                    'returns.  All investments involve risk.'].join(' '),
                    0, 3.5, 4.75, 1, { fontsize: 10, wrap: true })
                .text('Income Summary', 0, 4.5, 4.75, 0.5, { fontsize: 13 })
                .table(0, 4.85, 4.75, 1, { data: 'incomeItems', 
                    groupBy: 'category', hasFooter: true, fontSize: 9 })
                    .column('50%', '   [description]', '', '', { 
                        align: 'left', group0Header: '[category]' })
                    .column('25%', '[currentPeriod]', 'This Period', '[SUM(currentPeriod)]', { align: 'right', footerStyle: { pattern: '$#,##0.00' } })
                    .column('25%', '[ytd]', 'Year-to-Date', '[SUM(ytd)]', { align: 'right', footerStyle: { pattern: '$#,##0.00' } })
            .pageFooter(0.5)
                .text('Page 1 of 1', 9, 0.5, 1.5, 0.25, { fontsize: 10, italic: true })
            .done();

        jsreports.render({
            report_def: report,
            target: $(".report-output").css('min-height', '900px'),
            datasets: dataSources,
            showToolbar: true,
            scaleFonts: true
        });
    }

    invoiceReport()
    {
        var items = [{
                category: 'Professional Services',
                description: 'Software Development',
                unitLabel: 'Hours',
                quantity: 12,
                unitPrice: 150.00
              },{
                category: 'Expenses',
                description: 'Coffee for office',
                unitLabel: 'Qty',
                quantity: 4,
                unitPrice: 10.51
              },{
                category: 'Expenses',
                description: 'New keyboard',
                unitLabel: 'Qty',
                quantity: 3,
                unitPrice: 32.99
              },{
                category: 'Expenses',
                description: 'New Mouse',
                unitLabel: 'Qty',
                quantity: 100,
                unitPrice: 320.99
              },{
                category: 'Professional Services',
                description: 'Software Development',
                unitLabel: 'Hours',
                quantity: 12,
                unitPrice: 150.00
              },{
                category: 'Expenses',
                description: 'Coffee for office',
                unitLabel: 'Qty',
                quantity: 4,
                unitPrice: 10.51
              },{
                category: 'Expenses',
                description: 'New keyboard',
                unitLabel: 'Qty',
                quantity: 3,
                unitPrice: 32.99
              },{
                category: 'Expenses',
                description: 'New Mouse',
                unitLabel: 'Qty',
                quantity: 100,
                unitPrice: 320.99
              },{
                category: 'Professional Services',
                description: 'Software Development',
                unitLabel: 'Hours',
                quantity: 12,
                unitPrice: 150.00
              },{
                category: 'Expenses',
                description: 'Coffee for office',
                unitLabel: 'Qty',
                quantity: 4,
                unitPrice: 10.51
              },{
                category: 'Expenses',
                description: 'New keyboard',
                unitLabel: 'Qty',
                quantity: 3,
                unitPrice: 32.99
              },{
                category: 'Expenses',
                description: 'New Mouse',
                unitLabel: 'Qty',
                quantity: 100,
                unitPrice: 320.99
              },{
                category: 'Professional Services',
                description: 'Software Development',
                unitLabel: 'Hours',
                quantity: 12,
                unitPrice: 150.00
              },{
                category: 'Expenses',
                description: 'Coffee for office',
                unitLabel: 'Qty',
                quantity: 4,
                unitPrice: 10.51
              },{
                category: 'Expenses',
                description: 'New keyboard',
                unitLabel: 'Qty',
                quantity: 3,
                unitPrice: 32.99
              },{
                category: 'Expenses',
                description: 'New Mouse',
                unitLabel: 'Qty',
                quantity: 100,
                unitPrice: 320.99
              },{
                category: 'Professional Services',
                description: 'Software Development',
                unitLabel: 'Hours',
                quantity: 12,
                unitPrice: 150.00
              },{
                category: 'Expenses',
                description: 'Coffee for office',
                unitLabel: 'Qty',
                quantity: 4,
                unitPrice: 10.51
              },{
                category: 'Expenses',
                description: 'New keyboard',
                unitLabel: 'Qty',
                quantity: 3,
                unitPrice: 32.99
              },{
                category: 'Expenses',
                description: 'New Mouse',
                unitLabel: 'Qty',
                quantity: 100,
                unitPrice: 320.99
              }];        

        var dataSources = [{
            "id": "Invoice_Data",
            "name": "Invoice Detail",
            "data": [{
                "printDate": new Date(),
                "startDate": new Date(2015, 11, 1),
                "endDate": new Date(2015, 11, 31),
                "companyInfo": "118, Dilkusha C/A, Motijheel(Level-25), Dhaka-1000",
                "userAddress": 'Dhaka-1207',
                "accountHolderId": 'AC0001',
                "vatNo":"00000000",
                "accountHolder": 'Shashangka Shekhar',
                "invoiceNumber": 'INV-00000001',
                "subTotal": '$150,450.08',
                "disctTotal": '$1000.00',
                "grndTotal": '$149,450.08',
                "taxAmount": '$0.00',
                "rptItems": items,
                "inWord": 'One Hundred Forty-Nine Thousand Four Hundred Fifty and Eight.'              
            }]
        }];

        var report = jsreports.createReport()
            .name('Invoice-' + new Date().toString())
            .data('Invoice_Data')
            .page(8.27, 11.69, 'inches')
            .margins(0.55)
       
            .header(0.5)
            .image('assets/magnifibank-logo.png', 0, 0, 2, 1)
            .text('[companyInfo]', 0, 0.4, 2.5, 1, { fontsize: 10, align: 'left', wrap: true })
            .text('INVOICE: [invoiceNumber]', 2.40, 0.15, 4.75, 0, { bold: true, align: 'right', fontsize: 11 })    
            .text('VAT NO:', 2.40, 0.35, 4.1, 0, { align: 'right',bold:true, fontsize: 9 })
            .text('[vatNo]', 2.40, 0.35, 4.75, 0, { align: 'right', fontsize: 9 })
            .text('Billed To:', 0, 1, 6.2, 0, { bold: true, fontsize: 13, align: 'left', underline: true })
            .text('[accountHolder]' + ', ' + '[userAddress]', 0.2, 1.2, 4.6, 0, { fontsize: 10, align: 'left' }) 
            .text('Date: ', 6.1, 1, 1, 0, { align: 'left', bold: true, fontsize: 9 })
            .text('[=FORMAT(printDate, \'mmm d, yyyy\')]', 6, 1, 1.2, 0, { align: 'right', bold: false, fontsize: 9 })
            .text('Period:', 4.25, 1.2, 0.9, 0, { align: 'right', bold: true, fontsize: 9 })
            .text('From [=FORMAT(startDate, \'mmm d, yyyy\')] To [=FORMAT(endDate, \'mmm d, yyyy\')]', 5, 1.2, 2.2, 0, { align: 'right', bold: false, fontsize: 9 })

            .footer(0.7)         
            .text('Sub-Total: ', 0, -0.15, 6.1, 0, { bold: true, align: 'right', fontsize: 11 })
            .text('[subTotal]', 6.1, -0.15, 1.1, 0, { bold: true, align: 'right', fontsize: 11 })
            .text('Discount: ', 0, 0.08, 6.1, 0, { bold: true, align: 'right', fontsize: 11 })
            .text('[disctTotal]', 6.1, 0.08, 1.1, 0, { bold: true, align: 'right', fontsize: 11 })
            .text('Vat: ', 0, 0.3, 6.1, 0, { bold: true, align: 'right', fontsize: 11 })
            .text('[taxAmount]', 6.1, 0.3, 1.1, 0, { bold: true, align: 'right', fontsize: 11 })
            .text('=========================', 2.40, 0.47, 4.80, 0, { bold: false, align: 'right', fontsize: 11 })
            .text('Grand-Total: ', 0, 0.65, 6.1, 0, { bold: true, align: 'right',fontsize: 11 })
            .text('[grndTotal]', 6.1, 0.65, 1.1, 0, { bold: true, align: 'right', fontsize: 11 })
            .text('In word: [inWord]', 0, 0.25, 3, 0, { bold: true, align: 'left' })

            .detail(1)
            .text('Invoice Details:', 0, 0.2, 7.2, 1, { bold: true, fontsize: 13, align: 'left', underline: true })
            .table(0, 0.5, 7.2,1, { data: 'rptItems', hasFooter: true, hasHeader: true, fontsize: 10 })
            .column('', '[description]', 'Particulars', '', { wrap: true, align: 'left' })
            .column('10%', '[quantity]', 'Qty', '', { align: 'center'}) 
            .column('12%', '[unitPrice]', 'Price', '', { align: 'right' }) 
            .column('15%', '[=quantity * unitPrice]', 'Total', '', { align: 'right' }) 
            
            .pageFooter(0.7)
            .text('Printed on: [=FORMAT(DATE(), \'dd/MM/yyyy\')]', 0, 0.4, 4.75, 0.2, { align: 'left', fontsize: 8 })
            .text('© [=FORMAT(DATE(), \'yyyy\')], All Rights Reserved.', 0, 0.55, 7.2, 0.25, { fontsize: 8, align: 'left' })
            .text('Page [PAGE_NUMBER] of [PAGE_COUNT]', 0, 0.55, 7.2, 0.25, { fontsize: 8, italic: true, align: 'right' })
            .done();
        
            jsreports.render({
                report_def: report,
                target: $('.report-output').css('min-height', '900px'),
                datasets: dataSources,
                showToolbar: true,
                scaleFonts: false
            });
    }
}

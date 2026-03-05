import { Component } from '@angular/core';

@Component({
  selector: 'app-report',
  standalone: true,
  template: `
    <div class="report-container">
      <h2>Individual Report</h2>
      <p>Select or generate a report to view details.</p>
    </div>
  `,
  styles: [
    `
      .report-container {
        padding: 20px;
      }
    `,
  ],
})
export class ReportComponent {}

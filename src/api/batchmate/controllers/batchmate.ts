/**
 * batchmate controller
 */

import { factories } from '@strapi/strapi';
import ExcelJS from 'exceljs';

export default factories.createCoreController('api::batchmate.batchmate', ({ strapi }) => ({
  async find(ctx) {
    // Use the default find with populate
    ctx.query = {
      ...ctx.query,
      populate: ctx.query.populate || '*',
    };
    
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    
    // Use the default findOne with populate
    ctx.query = {
      ...ctx.query,
      populate: ctx.query.populate || '*',
    };

    const response = await super.findOne(ctx);
    return response;
  },

  async create(ctx) {
    const response = await super.create(ctx);
    return response;
  },

  async update(ctx) {
    const response = await super.update(ctx);
    return response;
  },

  async delete(ctx) {
    const response = await super.delete(ctx);
    return response;
  },

  /**
   * Export field-wise name lists
   * Creates separate sheets for each field with alphabetically sorted names
   */
  async exportFieldwise(ctx) {
    try {
      // Fetch all batchmates
      const batchmates = await strapi.entityService.findMany('api::batchmate.batchmate', {
        fields: ['callingName', 'fullName', 'field'],
        sort: 'callingName:asc',
      });

      if (!batchmates || batchmates.length === 0) {
        ctx.throw(404, 'No batchmates found');
      }

      // Group by field
      const groupedByField = {};
      batchmates.forEach(batchmate => {
        const field = batchmate.field || 'Unknown';
        if (!groupedByField[field]) {
          groupedByField[field] = [];
        }
        groupedByField[field].push(batchmate);
      });

      // Create workbook
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Alumni Hub';
      workbook.created = new Date();

      // Create a sheet for each field
      Object.keys(groupedByField).sort().forEach(field => {
        const data = groupedByField[field];
        
        // Sort alphabetically by calling name, then full name
        data.sort((a, b) => {
          const nameA = (a.callingName || a.fullName || '').toLowerCase();
          const nameB = (b.callingName || b.fullName || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });

        // Create safe sheet name (Excel has character limits and restrictions)
        const sheetName = field.replace(/[:\\/?*\[\]]/g, '_').substring(0, 31);
        const worksheet = workbook.addWorksheet(sheetName);

        // Add header row
        worksheet.addRow(['Calling Name', 'Full Name']);
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, size: 12 };
        headerRow.alignment = { vertical: 'middle', horizontal: 'left' };

        // Add data rows
        data.forEach(batchmate => {
          worksheet.addRow([
            batchmate.callingName || '',
            batchmate.fullName || ''
          ]);
        });

        // Set column widths
        worksheet.getColumn(1).width = 25;
        worksheet.getColumn(2).width = 35;

        // Simple styling - no borders as requested
        worksheet.eachRow((row, rowNumber) => {
          row.eachCell(cell => {
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
          });
        });
      });

      // Generate buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Set response headers
      ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      ctx.set('Content-Disposition', `attachment; filename="Fieldwise_Name_Lists_${new Date().toISOString().split('T')[0]}.xlsx"`);
      
      ctx.body = buffer;
    } catch (error) {
      strapi.log.error('Error generating fieldwise export:', error);
      ctx.throw(500, 'Failed to generate export');
    }
  },

  /**
   * Export raffle cut sheet
   * Single column with bordered cells for printing and cutting
   */
  async exportRaffleCutSheet(ctx) {
    try {
      // Fetch all batchmates with full name
      const batchmates = await strapi.entityService.findMany('api::batchmate.batchmate', {
        fields: ['fullName'],
      });

      if (!batchmates || batchmates.length === 0) {
        ctx.throw(404, 'No batchmates found');
      }

      // Create workbook
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Alumni Hub';
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet('Raffle_Draw_Names');

      // Add header
      worksheet.addRow(['Full Name']);
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, size: 14 };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headerRow.height = 25;

      // Apply border to header
      headerRow.eachCell(cell => {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' }
        };
      });

      // Add each name with borders (not sorted as requested)
      batchmates.forEach(batchmate => {
        const name = batchmate.fullName || 'Unknown';
        const row = worksheet.addRow([name]);
        
        // Set row height for easy cutting
        row.height = 30;
        
        // Apply styling
        row.eachCell(cell => {
          cell.font = { size: 12 };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          
          // Apply full borders
          cell.border = {
            top: { style: 'medium' },
            left: { style: 'medium' },
            bottom: { style: 'medium' },
            right: { style: 'medium' }
          };
        });
      });

      // Set column width
      worksheet.getColumn(1).width = 50;

      // Generate buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Set response headers
      ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      ctx.set('Content-Disposition', `attachment; filename="Raffle_Cut_Sheet_${new Date().toISOString().split('T')[0]}.xlsx"`);
      
      ctx.body = buffer;
    } catch (error) {
      strapi.log.error('Error generating raffle cut sheet:', error);
      ctx.throw(500, 'Failed to generate raffle cut sheet');
    }
  },
}));

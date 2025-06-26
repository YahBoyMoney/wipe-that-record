import { CollectionConfig } from 'payload';

const EmailSequences: CollectionConfig = {
  slug: 'email_sequences',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name','segment','delayMinutes','subject','active'],
    group: 'Marketing'
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role==='superadmin',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role==='superadmin',
    delete: ({ req }) => req.user?.role==='superadmin'
  },
  fields:[
    { name:'name', type:'text', required:true },
    { name:'segment', type:'select', options:[
      {label:'All', value:'all'},
      {label:'Hot Leads', value:'hot'},
      {label:'Warm Leads', value:'warm'},
      {label:'Customers', value:'customers'},
    ], required:true },
    { name:'delayMinutes', type:'number', required:true, admin:{ description:'Delay after previous email in minutes'}},
    { name:'subject', type:'text', required:true },
    { name:'body', type:'richText', required:true },
    { name:'active', type:'checkbox', defaultValue:true }
  ],
  timestamps:true,
};

export default EmailSequences; 
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.suppliers': 'Suppliers',
    'nav.products': 'Products',
    'nav.inventory': 'Inventory',
    'nav.access': 'Access',
    'nav.sales': 'Sales',
    'nav.installment': 'Installment',
    'nav.purchase': 'Purchase',
    'nav.purchaseInstallment': 'Purchase Installment',
    'nav.customers': 'Customers',
    'nav.lotControl': 'Lot Control',

    // Common
    'common.login': 'Login',
    'common.password': 'Password',
    'common.logout': 'Logout',
    'common.search': 'Search',
    'common.actions': 'Actions',
    'common.edit': 'Edit',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.update': 'Update',
    'common.delete': 'Delete',

    // Confirmation Modals
    'confirm.updateTitle': 'Confirm Update',
    'confirm.deleteTitle': 'Confirm Delete',
    'confirm.updateMessage': 'Are you sure you want to update this item? This action cannot be undone.',
    'confirm.deleteMessage': 'Are you sure you want to delete "{item}"? This action cannot be undone.',
    'confirm.supplierUpdateMessage': 'Are you sure you want to update this supplier? This action cannot be undone.',
    'confirm.supplierDeleteMessage': 'Are you sure you want to delete "{name}"? This action cannot be undone.',
    'confirm.productUpdateMessage': 'Are you sure you want to update this product? This action cannot be undone.',
    'confirm.productDeleteMessage': 'Are you sure you want to delete "{name}"? This action cannot be undone.',
    'confirm.userUpdateMessage': 'Are you sure you want to update this user? This action cannot be undone.',
    'confirm.userDeleteMessage': 'Are you sure you want to delete "{username}"? This action cannot be undone.',
    'confirm.lotUpdateMessage': 'Are you sure you want to update this lot batch? This action cannot be undone.',
    'confirm.lotDeleteMessage': 'Are you sure you want to delete "{lotNumber}"? This action cannot be undone.',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.totalSuppliers': 'Total Suppliers',
    'dashboard.activeProducts': 'Active Products',
    'dashboard.userAccounts': 'User Accounts',
    'dashboard.lotBatches': 'Lot Batches',
    'dashboard.systemOverview': 'System Overview',
    'dashboard.recentActivity': 'Recent Activity',

    // Suppliers
    'suppliers.title': 'Suppliers',
    'suppliers.addSupplier': 'Add Supplier',
    'suppliers.name': 'Name',
    'suppliers.branch': 'Branch',
    'suppliers.contact': 'Contact',
    'suppliers.email': 'Email',
    'suppliers.phone': 'Phone',
    'suppliers.status': 'Status',
    'suppliers.lastUpdated': 'Last Updated',

    // Products
    'products.title': 'Products',
    'products.addProduct': 'Add Product',
    'products.sku': 'SKU',
    'products.name': 'Name',
    'products.brand': 'Brand',
    'products.model': 'Model',
    'products.category': 'Category',
    'products.description': 'Description',
    'products.lastUpdated': 'Last Updated',

    // Access Management
    'access.title': 'Access',
    'access.addUser': 'Add User',
    'access.username': 'Username',
    'access.email': 'Email',
    'access.role': 'Role',
    'access.status': 'Status',
    'access.lastLogin': 'Last Login',

    // Sales
    'sales.title': 'Sales',
    'sales.addSale': 'Add Sale',
    'sales.date': 'Date',
    'sales.customer': 'Customer',
    'sales.product': 'Product',
    'sales.quantity': 'Quantity',
    'sales.total': 'Total',

    // Customers
    'customers.title': 'Customers',
    'customers.addCustomer': 'Add Customer',
    'customers.name': 'Name',
    'customers.email': 'Email',
    'customers.phone': 'Phone',
    'customers.company': 'Company',
    'customers.address': 'Address',
    'customers.status': 'Status',
    'customers.active': 'Active',
    'customers.inactive': 'Inactive',
    'customers.lastContact': 'Last Contact',

    // Lot Control
    'lotControl.title': 'Lot Control',
    'lotControl.addLotBatch': 'Add Lot Batch',
    'lotControl.product': 'Product',
    'lotControl.lotNumber': 'Lot Number',
    'lotControl.quantity': 'Quantity',
    'lotControl.productionDate': 'Production Date',
    'lotControl.supplier': 'Supplier',
    'lotControl.materialCode': 'Material Code',
    'lotControl.materialImportDate': 'Material Import Date',
  },
  th: {
    // Navigation
    'nav.dashboard': 'แดชบอร์ด',
    'nav.suppliers': 'ซัพพลายเออร์',
    'nav.products': 'ผลิตภัณฑ์',
    'nav.inventory': 'คลังสินค้า',
    'nav.access': 'การเข้าถึง',
    'nav.sales': 'การขาย',
    'nav.installment': 'การผ่อนชำระ',
    'nav.purchase': 'การสั่งซื้อ',
    'nav.purchaseInstallment': 'การผ่อนชำระการสั่งซื้อ',
    'nav.customers': 'ลูกค้า',
    'nav.lotControl': 'ควบคุมล็อต',

    // Common
    'common.login': 'เข้าสู่ระบบ',
    'common.password': 'รหัสผ่าน',
    'common.logout': 'ออกจากระบบ',
    'common.search': 'ค้นหา',
    'common.actions': 'การดำเนินการ',
    'common.edit': 'แก้ไข',
    'common.save': 'บันทึก',
    'common.cancel': 'ยกเลิก',
    'common.close': 'ปิด',
    'common.update': 'อัปเดต',
    'common.delete': 'ลบ',

    // Confirmation Modals
    'confirm.updateTitle': 'ยืนยันการอัปเดต',
    'confirm.deleteTitle': 'ยืนยันการลบ',
    'confirm.updateMessage': 'คุณแน่ใจหรือไม่ที่จะอัปเดตรายการนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้',
    'confirm.deleteMessage': 'คุณแน่ใจหรือไม่ที่จะลบ "{item}"? การดำเนินการนี้ไม่สามารถยกเลิกได้',
    'confirm.supplierUpdateMessage': 'คุณแน่ใจหรือไม่ที่จะอัปเดตซัพพลายเออร์นี้? การดำเนินการนี้ไม่สามารถยกเลิกได้',
    'confirm.supplierDeleteMessage': 'คุณแน่ใจหรือไม่ที่จะลบ "{name}"? การดำเนินการนี้ไม่สามารถยกเลิกได้',
    'confirm.productUpdateMessage': 'คุณแน่ใจหรือไม่ที่จะอัปเดตผลิตภัณฑ์นี้? การดำเนินการนี้ไม่สามารถยกเลิกได้',
    'confirm.productDeleteMessage': 'คุณแน่ใจหรือไม่ที่จะลบ "{name}"? การดำเนินการนี้ไม่สามารถยกเลิกได้',
    'confirm.userUpdateMessage': 'คุณแน่ใจหรือไม่ที่จะอัปเดตผู้ใช้นี้? การดำเนินการนี้ไม่สามารถยกเลิกได้',
    'confirm.userDeleteMessage': 'คุณแน่ใจหรือไม่ที่จะลบ "{username}"? การดำเนินการนี้ไม่สามารถยกเลิกได้',
    'confirm.lotUpdateMessage': 'คุณแน่ใจหรือไม่ที่จะอัปเดตล็อตนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้',
    'confirm.lotDeleteMessage': 'คุณแน่ใจหรือไม่ที่จะลบ "{lotNumber}"? การดำเนินการนี้ไม่สามารถยกเลิกได้',

    // Dashboard
    'dashboard.title': 'แดชบอร์ด',
    'dashboard.totalSuppliers': 'ซัพพลายเออร์ทั้งหมด',
    'dashboard.activeProducts': 'ผลิตภัณฑ์ที่ใช้งาน',
    'dashboard.userAccounts': 'บัญชีผู้ใช้',
    'dashboard.lotBatches': 'ล็อตทั้งหมด',
    'dashboard.systemOverview': 'ภาพรวมระบบ',
    'dashboard.recentActivity': 'กิจกรรมล่าสุด',

    // Suppliers
    'suppliers.title': 'ซัพพลายเออร์',
    'suppliers.addSupplier': 'เพิ่มซัพพลายเออร์',
    'suppliers.branch': 'สาขา',
    'suppliers.name': 'ชื่อ',
    'suppliers.contact': 'ผู้ติดต่อ',
    'suppliers.email': 'อีเมล',
    'suppliers.phone': 'โทรศัพท์',
    'suppliers.status': 'สถานะ',
    'suppliers.lastUpdated': 'อัปเดตล่าสุด',

    // Products
    'products.title': 'ผลิตภัณฑ์',
    'products.addProduct': 'เพิ่มผลิตภัณฑ์',
    'products.sku': 'รหัสสินค้า',
    'products.name': 'ชื่อ',
    'products.brand': 'ยี่ห้อ',
    'products.model': 'รุ่น',
    'products.category': 'หมวดหมู่',
    'products.description': 'คำอธิบาย',
    'products.lastUpdated': 'อัปเดตล่าสุด',

    // Access Management
    'access.title': 'การเข้าถึง',
    'access.addUser': 'เพิ่มผู้ใช้',
    'access.username': 'ชื่อผู้ใช้',
    'access.email': 'อีเมล',
    'access.role': 'บทบาท',
    'access.status': 'สถานะ',
    'access.lastLogin': 'เข้าสู่ระบบล่าสุด',

    // Sales
    'sales.title': 'การขาย',
    'sales.addSale': 'เพิ่มการขาย',
    'sales.date': 'วันที่',
    'sales.customer': 'ลูกค้า',
    'sales.product': 'สินค้า',
    'sales.quantity': 'จำนวน',
    'sales.total': 'รวม',

    // Customers
    'customers.title': 'ลูกค้า',
    'customers.addCustomer': 'เพิ่มลูกค้า',
    'customers.name': 'ชื่อ',
    'customers.email': 'อีเมล',
    'customers.phone': 'โทรศัพท์',
    'customers.company': 'บริษัท',
    'customers.address': 'ที่อยู่',
    'customers.status': 'สถานะ',
    'customers.active': 'ใช้งาน',
    'customers.inactive': 'ไม่ใช้งาน',
    'customers.lastContact': 'ติดต่อล่าสุด',

    // Lot Control
    'lotControl.title': 'ควบคุมล็อต',
    'lotControl.addLotBatch': 'เพิ่มล็อต',
    'lotControl.product': 'ผลิตภัณฑ์',
    'lotControl.lotNumber': 'หมายเลขล็อต',
    'lotControl.quantity': 'จำนวน',
    'lotControl.productionDate': 'วันที่ผลิต',
    'lotControl.supplier': 'ซัพพลายเออร์',
    'lotControl.materialCode': 'รหัสวัสดุ',
    'lotControl.materialImportDate': 'วันที่นำเข้าวัสดุ',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'th')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 
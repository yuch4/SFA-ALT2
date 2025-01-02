import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/main-layout';
import { AuthGuard } from './features/auth/auth-guard';
import { AuthPage } from './features/auth/auth-page';
import { AccountList } from './features/accounts/account-list';
import { AccountDetail } from './features/accounts/account-detail';
import { AccountCreate } from './features/accounts/account-create';
import { ProjectList } from './features/projects/project-list';
import { ProjectDetail } from './features/projects/project-detail';
import { ProjectCreate } from './features/projects/project-create';
import { QuotationsPage } from './features/quotations/quotations-page';
import { QuotationDetail } from './features/quotations/quotation-detail';
import { QuotationCreate } from './features/quotations/quotation-create';
import { QuotationEdit } from './features/quotations/quotation-edit';
import { SupplierList } from './features/suppliers/supplier-list';
import { SupplierDetail } from './features/suppliers/supplier-detail';
import { SupplierCreate } from './features/suppliers/supplier-create';
import { ProjectCodeList } from './features/project-codes/project-code-list';
import { ProjectCodeDetail } from './features/project-codes/project-code-detail';
import { TaskList } from './features/tasks/task-list';
import { TaskDetail } from './features/tasks/task-detail';
import { UserList } from './features/users';
import { PurchaseOrderList } from './features/purchase-orders/purchase-order-list';
import { PurchaseOrderDetail } from './features/purchase-orders/purchase-order-detail';
import { PurchaseOrderEdit } from './features/purchase-orders/purchase-order-edit';
import { ApprovalFlowList } from './features/approval-flows/approval-flow-list';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <AuthGuard>
              <MainLayout />
            </AuthGuard>
          }
        >
          <Route index element={<Navigate to="/accounts" replace />} />
          <Route path="accounts">
            <Route index element={<AccountList />} />
            <Route path="new" element={<AccountCreate />} />
            <Route path=":id" element={<AccountDetail />} />
          </Route>
          <Route path="projects">
            <Route index element={<ProjectList />} />
            <Route path="new" element={<ProjectCreate />} />
            <Route path=":id" element={<ProjectDetail />} />
          </Route>
          <Route path="quotations">
            <Route index element={<QuotationsPage />} />
            <Route path=":id" element={<QuotationDetail />} />
            <Route path=":id/edit" element={<QuotationEdit />} />
          </Route>
          <Route path="purchase-orders">
            <Route index element={<PurchaseOrderList />} />
            <Route path=":id" element={<PurchaseOrderDetail />} />
            <Route path=":id/edit" element={<PurchaseOrderEdit />} />
          </Route>
          <Route path="suppliers">
            <Route index element={<SupplierList />} />
            <Route path="new" element={<SupplierCreate />} />
            <Route path=":id" element={<SupplierDetail />} />
          </Route>
          <Route path="project-codes">
            <Route index element={<ProjectCodeList />} />
            <Route path=":id" element={<ProjectCodeDetail />} />
          </Route>
          <Route path="tasks">
            <Route index element={<TaskList />} />
            <Route path=":id" element={<TaskDetail />} />
          </Route>
          <Route path="users" element={<UserList />} />
          <Route path="approval-flows" element={<ApprovalFlowList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
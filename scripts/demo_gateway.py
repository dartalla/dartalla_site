"""Read-only screenshot fixtures in front of the existing Dartalla One Vite server.

No database, credentials, real sessions or remote API are read or forwarded.
Only localhost:3010 UI assets are proxied. API requests are answered locally.
"""
from __future__ import annotations

import base64
import json
import time
from datetime import date, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import HTTPError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen

BASE_DATE = date(2026, 10, 4)
STAMP = '2026-10-04T12:00:00-03:00'
USER_ID = 'usr_demo000000000001'
WORKSPACE_ID = 'ws_demo000000000001'
WORKSPACE = {
    'id': WORKSPACE_ID, 'name': 'Dartalla · Demonstração',
    'owner': USER_ID, 'created_by': USER_ID, 'is_active': True,
    'is_default': True, 'is_sandbox': False, 'has_sandbox': False,
    'business_type': {'id': 'bt_demo000000000001', 'name': 'Finanças Pessoais', 'slug': 'personal_finance', 'is_active': True},
    'logo': None, 'legal_name': 'Empresa Demonstrativa', 'created_at': STAMP,
}
PROFILE = {
    'id': USER_ID, 'email': 'demo@dartalla.example', 'first_name': 'Equipe',
    'last_name': 'Demo', 'full_name': 'Equipe Demo', 'displayName': 'Equipe Demo',
    'role': 'manager', 'owner': None, 'workspace': WORKSPACE_ID,
    'workspace_id': WORKSPACE_ID, 'is_active': True, 'is_onboarded': True,
    'is_staff': False, 'is_superuser': False, 'is_master': False,
    'picture': None, 'photoURL': None, 'oauth_provider': 'password',
}
CATEGORIES = [
    {'id': 'cat_demo'+str(i).zfill(12), 'name': name, 'group': group,
     'icon': icon, 'color': color, 'workspace': WORKSPACE_ID, 'owner': USER_ID}
    for i, (name,group,icon,color) in enumerate([
        ('Vendas','income','solar:shop-bold','#00A76F'),
        ('Serviços','income','solar:case-round-bold','#00A76F'),
        ('Fornecedores','expense','solar:box-bold','#8E33FF'),
        ('Estrutura','expense','solar:buildings-2-bold','#00B8D9'),
        ('Equipe','expense','solar:users-group-rounded-bold','#FFAB00'),
        ('Marketing','expense','solar:chart-bold','#FF5630'),
    ],1)
]
ACCOUNT = {'id':'acc_demo000000000001','name':'Conta da empresa','type':'checking',
    'balance':3620000,'workspace':WORKSPACE_ID,'owner':USER_ID,
    'is_default':True,'type_details':{'label':'Conta Corrente'},'bank':None}
TRANSACTIONS = []
for i,(description,amount,kind,category,day,realized) in enumerate([
    ('Recebimento · Loja Horizonte',2450000,'income',0,1,True),
    ('Serviços · Studio Aurora',1800000,'income',1,2,True),
    ('Compra de materiais',980000,'expense',2,1,True),
    ('Aluguel e estrutura',350000,'expense',3,2,True),
    ('Equipe · serviços contratados',180000,'expense',4,3,True),
    ('Campanha de divulgação',120000,'expense',5,3,True),
    ('Materiais · próxima entrega',240000,'expense',2,8,False),
    ('Serviços · suporte operacional',180000,'expense',3,10,False),
    ('Recebimento · Ateliê Nuvem',980000,'income',0,15,False),
],1):
    TRANSACTIONS.append({'id':'tr_demo'+str(i).zfill(12),'description':description,
       'amount':amount,'type':kind,'category':CATEGORIES[category],'account':ACCOUNT,
       'workspace':WORKSPACE_ID,'owner':USER_ID,'status':'realized' if realized else 'pending',
       'due_date':f'2026-10-{day:02d}', 'realized_at':f'2026-10-{day:02d}T12:00:00-03:00' if realized else None,
       'paid_at':f'2026-10-{day:02d}T12:00:00-03:00' if realized else None,'created_at':STAMP,'currency':'BRL','is_recurring':False,'is_fixed':False,
       'is_active':True,'is_owner':True,'credit_card_invoice':None,'destination_account':None})
CUSTOMERS = [{'id':'cust_demo'+str(i).zfill(12),'first_name':name,'last_name':'',
    'full_name':name,'email':f'contato{i}@empresa.example','phone':None,'tax_number':None,
    'person_type':'PJ','picture':None,'created_at':STAMP,'is_active':True,
    'workspace':WORKSPACE_ID,'owner':USER_ID,'city':city,'state':'MG'}
    for i,(name,city) in enumerate([
      ('Loja Horizonte','Uberlândia'),('Studio Aurora','Uberaba'),
      ('Ateliê Nuvem','Belo Horizonte'),('Oficina Jardim','Uberlândia'),
      ('Mercado Vila Clara','Uberaba'),('Casa Essencial','Belo Horizonte')],1)]
DOCUMENTS = [{'id':'fd_demo'+str(i).zfill(12),'number':i,'series':1,'status':'DRAFT',
    'status_label':'Rascunho','issued_at':STAMP,'created_at':STAMP,
    'recipient_name':customer['full_name'],'customer_name':customer['full_name'],
    'total_cents':total,'total':total,'access_key':None,'workspace':WORKSPACE_ID,
    'document_type':'NFE','environment':'homologation','recipient':customer,
    'product_data':{'customer_info':{'name':customer['full_name']}}}
    for i,(customer,total) in enumerate(zip(CUSTOMERS[:4],[2450000,1800000,980000,420000]),1)]

class DemoGateway(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        # Deliberately exclude body, authorization, cookies and query parameters.
        print(self.command, urlsplit(self.path).path, flush=True)

    def page(self, rows):
        return {'count':len(rows),'next':None,'previous':None,'results':rows}

    def token(self):
        header=base64.urlsafe_b64encode(b'{"alg":"HS256","typ":"JWT"}').decode().rstrip('=')
        payload=base64.urlsafe_b64encode(json.dumps({'exp':int(time.time())+86400,
            'role':'user','user_id':USER_ID,'is_staff':False,'is_superuser':False}).encode()).decode().rstrip('=')
        return f'{header}.{payload}.demo-only-not-a-real-signature'

    def send_json(self, data, status=200):
        body=json.dumps(data,ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type','application/json; charset=utf-8')
        self.send_header('Cache-Control','no-store')
        self.send_header('Content-Length',str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def api(self, path):
        if path == '/user/profile/':return PROFILE
        if path.startswith('/workspace/'):
            return self.page([WORKSPACE]) if path=='/workspace/' else WORKSPACE
        if path=='/business-type/':return self.page([WORKSPACE['business_type']])
        if path=='/transaction/':return self.page(TRANSACTIONS)
        if path=='/account/':return self.page([ACCOUNT])
        if path=='/card/':return []
        if path=='/category/':return self.page(CATEGORIES)
        if path=='/customer/':return self.page(CUSTOMERS)
        if path=='/fiscal/nfe/':return DOCUMENTS
        if path=='/fiscal/capability/':return {'can_emit':False,'blocking_reasons':[{'message':'Ambiente demonstrativo: emissão desabilitada.'}],'environment':'homologation'}
        if path=='/totals/':return {'incomes':4250000,'expenses':1630000,'credit_cards_total':0}
        if path=='/current-balance/':return {'balance':3620000,'current_balance_cents':3620000}
        if path=='/spendable-balance/':return {'account_count':1,'current_balance_cents':3620000,
            'pending_expenses_cents':420000,'card_invoices_cents':0,'goals_reserved_cents':0,
            'minimum_reserve_cents':0,'available_to_spend_cents':3200000,
            'pending_incomes_cents':980000,'projected_balance_cents':4180000,
            'as_of':'2026-10-04','through':'2026-10-15','next_income_date':'2026-10-15','window_fallback':False}
        if path=='/expenses-by-category/':return [{'category':c['name'],'amount':a,'icon':c['icon']}
            for c,a in zip(CATEGORIES[2:],[980000,350000,180000,120000])]
        if path=='/category-commitments/':return [{'category':c['name'],'committed_cents':a+p,
            'settled_cents':a,'partial_card_allocation':False}
            for c,a,p in zip(CATEGORIES[2:],[980000,350000,180000,120000],[240000,180000,0,0])]
        if path=='/cash-radar/':
            days=[]
            for n in range(31):
                d=BASE_DATE+timedelta(days=n)
                conservative=3620000-(240000 if d>=date(2026,10,8) else 0)-(180000 if d>=date(2026,10,10) else 0)
                days.append({'date':d.isoformat(),'conservative_balance_cents':conservative,
                    'projected_balance_cents':conservative+(980000 if d>=date(2026,10,15) else 0)})
            return {'account_count':1,'as_of':BASE_DATE.isoformat(),'through':days[-1]['date'],
                'first_negative_date':None,'minimum_balance_cents':3200000,'days':days,'drivers':[]}
        if path=='/organization-pending/':return {'kind':'uncategorized','groups':[
            {'kind':'uncategorized','label':'Sem categoria','count':0},
            {'kind':'reconciliation','label':'Extratos para conciliar','count':0},
            {'kind':'failed_imports','label':'Importações com falha','count':0}],
            'results':[],'count':0,'page':1,'next_number':None,'previous_number':None}
        if path=='/credit-card-invoice-funnel/':return {'statuses':[],'due_buckets':[]}
        if path=='/budget-overview/':return {'planning':None,'totals':{'budget_amount':0,'spent_amount':1630000,'variance_amount':0,'remaining_budget':0},'categories':[]}
        if path=='/burn-rate/':return {'categories':[],'series':[]}
        if path.startswith('/notifications') or path.startswith('/notification'):
            return {'results':[],'count':0,'unread_count':0,'next':None,'previous':None}
        if path=='/billing/subscription/':return {'status':'active','has_access':True,'current_period_end':'2027-01-01T00:00:00Z','plan':{'name':'Demonstração','modules':['finance','fiscal'],'segment':{'slug':'personal_finance'}}}
        if path.startswith('/chat/') and 'summary' in path:return {'total_unread':0,'totalUnread':0}
        # Empty optional lists only; unimplemented actions remain unavailable.
        return self.page([])

    def do_GET(self):
        path=urlsplit(self.path).path
        if path.startswith('/api/'):
            if not path.startswith('/api/v1/'):
                return self.send_json({'detail':'API disponível apenas em modo demonstrativo.'},404)
            return self.send_json(self.api(path[len('/api/v1'):]))
        # Never forward browser cookies or authentication to the existing server.
        request=Request('http://127.0.0.1:3010'+self.path,headers={'Accept-Encoding':'identity'})
        try:
            with urlopen(request,timeout=30) as response:
                body=response.read()
                content_type=response.headers.get('Content-Type','application/octet-stream')
                if path=='/src/global-config.js':
                    source = b"serverUrl: import.meta.env.VITE_SERVER_URL ?? ''"
                    if source not in body:
                        return self.send_json({'detail':'Contrato de configuração alterado; captura bloqueada para impedir acesso à API real.'},502)
                    body=body.replace(source,b"serverUrl: ''")
                self.send_response(response.status)
                self.send_header('Content-Type',content_type)
                self.send_header('Content-Length',str(len(body)))
                self.send_header('Cache-Control','no-store')
                self.end_headers()
                self.wfile.write(body)
        except (HTTPError,OSError):
            self.send_json({'detail':'Frontend local indisponível.'},502)

    def do_POST(self):
        path=urlsplit(self.path).path
        if path in ['/api/v1/auth/token/','/api/v1/auth/token/refresh/']:
            # Demo input is discarded; no real authentication or external call.
            self.rfile.read(int(self.headers.get('Content-Length','0')))
            return self.send_json({'access':self.token(),'refresh':self.token()})
        self.send_json({'detail':'Ações de escrita e emissão estão desabilitadas na demonstração.'},405)

if __name__=='__main__':
    print('Screenshot gateway: http://127.0.0.1:3020 (fixtures only; no database)',flush=True)
    ThreadingHTTPServer(('127.0.0.1',3020),DemoGateway).serve_forever()

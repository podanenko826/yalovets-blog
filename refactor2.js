const fs = require('fs');
const path = require('path');

const replacements = {
    'status: true': 'is_active: true',
    'status: false': 'is_active: false',
    'status: boolean': 'is_active: boolean',
    'status,': 'is_active,',
    'subscriber.status': 'subscriber.is_active',
    'status: subscriber.status': 'is_active: subscriber.is_active',
    'status ?': 'is_active ?'
};

const exactReplacements = [
    {
        file: 'src/lib/subscribers.ts',
        replacements: [
            ['status: true', 'is_active: true'],
            ['subscriber.is_active === status', 'subscriber.is_active === is_active'],
            ['export const getSubscribersByStatus = async (status: boolean)', 'export const getSubscribersByStatus = async (is_active: boolean)'],
            ['status: subscriber.status', 'is_active: subscriber.is_active'],
            ['export const updateSubscriberStatus = async (subscriber: SubscriberItem, status: boolean)', 'export const updateSubscriberStatus = async (subscriber: SubscriberItem, is_active: boolean)'],
            ['status,', 'is_active,'],
        ]
    },
    {
        file: 'src/types/index.ts',
        replacements: [
            ['status: boolean;', 'is_active: boolean;']
        ]
    },
    {
        file: 'src/components/Modals/SubscribeModal.tsx',
        replacements: [
            ['status: true', 'is_active: true']
        ]
    },
    {
        file: 'src/app/(admin)/admin/subscribers/page.tsx',
        replacements: [
            ["<td>{subscriber.status ? 'Active' : 'Inactive'}</td>", "<td>{subscriber.is_active ? 'Active' : 'Inactive'}</td>"],
            ['htmlFor="status"', 'htmlFor="is_active"'],
            ["handleEditInputChange('status'", "handleEditInputChange('is_active'"],
            ["checked={selectedSubscriber?.status || false}", "checked={selectedSubscriber?.is_active || false}"]
        ]
    }
];

exactReplacements.forEach(({ file, replacements }) => {
    let content = fs.readFileSync(file, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.split(search).join(replace);
    }
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
});

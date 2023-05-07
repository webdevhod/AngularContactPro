// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { CategoryComponent } from './category.component';
import { ICategory } from '../category.model';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { moduleMetadata } from '@storybook/angular';
import dayjs from 'dayjs/esm';
import { IUser } from 'app/admin/user-management/user-management.model';
import { IContact } from 'app/entities/contact/contact.model';

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
export default {
    title: 'Entities/Category',
    component: CategoryComponent,

    // imports: [NgbModal],
    decorators: [
        moduleMetadata({
            imports: [
                HttpClientModule
                
            ],
        })
    ]

} as Meta;

// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: Story<CategoryComponent> = (args: CategoryComponent) => ({
    props: args,
});

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/angular/writing-stories/args
Primary.args = {
    isLoading: false,
    categories: [{
        id: 1,
        name: 'Friends',
        contacts: [
            {
                id: 2,
                firstName: "string",
                lastName: "string"
            }
        ] as IContact[],
        created: dayjs(),
        user: { id: "1", login: "dh@gmail.com" } as IUser
    },] as ICategory[]
};

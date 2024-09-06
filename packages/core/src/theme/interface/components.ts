// import type { ComponentToken as WaveToken } from '../../_util/wave/style';
// import type { ComponentToken as AlertComponentToken } from '../../alert/style';
// import type { ComponentToken as AnchorComponentToken } from '../../anchor/style';
// import type { ComponentToken as AppComponentToken } from '../../app/style';
// import type { ComponentToken as AvatarComponentToken } from '../../avatar/style';
// import type { ComponentToken as BackTopComponentToken } from '../../back-top/style';
// import type { ComponentToken as BadgeComponentToken } from '../../badge/style';
// import type { ComponentToken as BreadcrumbComponentToken } from '../../breadcrumb/style';
import type { AffixComponentToken, ButtonComponentToken } from '@bees-ui/sc-type';

interface WaveToken {}
interface FlexComponentToken {}

export interface ComponentTokenMap {
  Affix?: AffixComponentToken;
  // Alert?: AlertComponentToken;
  // Anchor?: AnchorComponentToken;
  // Avatar?: AvatarComponentToken;
  // BackTop?: BackTopComponentToken;
  // Badge?: BadgeComponentToken;
  Button?: ButtonComponentToken;
  // Breadcrumb?: BreadcrumbComponentToken;
  // Card?: CardComponentToken;
  // Carousel?: CarouselComponentToken;
  // Cascader?: CascaderComponentToken;
  // Checkbox?: CheckboxComponentToken;
  // ColorPicker?: ColorPickerComponentToken;
  // Collapse?: CollapseComponentToken;
  // DatePicker?: DatePickerComponentToken;
  // Descriptions?: DescriptionsComponentToken;
  // Divider?: DividerComponentToken;
  // Drawer?: DrawerComponentToken;
  // Dropdown?: DropdownComponentToken;
  // Empty?: EmptyComponentToken;
  Flex?: FlexComponentToken;
  // FloatButton?: FloatButtonComponentToken;
  // Form?: FormComponentToken;
  // Grid?: GridComponentToken;
  // Image?: ImageComponentToken;
  // Input?: InputComponentToken;
  // InputNumber?: InputNumberComponentToken;
  // Layout?: LayoutComponentToken;
  // List?: ListComponentToken;
  // Mentions?: MentionsComponentToken;
  // Notification?: NotificationComponentToken;
  // Pagination?: PaginationComponentToken;
  // Popover?: PopoverComponentToken;
  // Popconfirm?: PopconfirmComponentToken;
  // Rate?: RateComponentToken;
  // Radio?: RadioComponentToken;
  // Result?: ResultComponentToken;
  // Segmented?: SegmentedComponentToken;
  // Select?: SelectComponentToken;
  // Skeleton?: SkeletonComponentToken;
  // Slider?: SliderComponentToken;
  // Spin?: SpinComponentToken;
  // Statistic?: StatisticComponentToken;
  // Switch?: SwitchComponentToken;
  // Tag?: TagComponentToken;
  // Tree?: TreeComponentToken;
  // TreeSelect?: TreeSelectComponentToken;
  // Typography?: TypographyComponentToken;
  // Timeline?: TimelineComponentToken;
  // Transfer?: TransferComponentToken;
  // Tabs?: TabsComponentToken;
  // Calendar?: CalendarComponentToken;
  // Steps?: StepsComponentToken;
  // Menu?: MenuComponentToken;
  // Modal?: ModalComponentToken;
  // Message?: MessageComponentToken;
  // Upload?: UploadComponentToken;
  // Tooltip?: TooltipComponentToken;
  // Table?: TableComponentToken;
  // Space?: SpaceComponentToken;
  // Progress?: ProgressComponentToken;
  // Tour?: TourComponentToken;
  // QRCode?: QRCodeComponentToken;
  // App?: AppComponentToken;

  /** @private Internal TS definition. Do not use. */
  Wave?: WaveToken;
}

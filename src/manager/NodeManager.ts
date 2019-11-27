import { NodeInfo } from '../repository/assistant/NodeInfo';
import { NonceSource } from '../repository/assistant/NonceSource';
import { PermissionsSource } from '../repository/assistant/PermissionsSource';
import { SiteDataSource } from '../repository/assistant/SiteDataSource';

export interface NodeManager extends PermissionsSource, NonceSource, SiteDataSource, NodeInfo {
}

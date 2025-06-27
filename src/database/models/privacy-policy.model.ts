import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({
  tableName: 'privacy_policies',
  timestamps: true,
  underscored: true,
})
export class PrivacyPolicy extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
    defaultValue: DataType.NOW,
  })
  created_at: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
    defaultValue: DataType.NOW,
  })
  updated_at: Date;

  @Column({
    type: DataType.BOOLEAN,
    field: 'is_deleted',
    defaultValue: false,
  })
  is_deleted: boolean;
}

export default PrivacyPolicy;
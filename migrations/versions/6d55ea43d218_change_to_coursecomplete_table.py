"""change to coursecomplete table

Revision ID: 6d55ea43d218
Revises: a09f6404d6ae
Create Date: 2021-06-08 09:40:34.967519

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6d55ea43d218'
down_revision = 'a09f6404d6ae'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('usersCourseCompleteDate', 'user_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('usersCourseCompleteDate', 'course_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('usersCourseCompleteDate', 'course_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('usersCourseCompleteDate', 'user_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    # ### end Alembic commands ###

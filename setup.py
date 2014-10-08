from setuptools import setup, find_packages
import os

version = '0.0.1'

setup(
    name='mreq',
    version=version,
    description='Material Request Handler',
    author='IndictransTech',
    author_email='saurabh6790@gmailc.om',
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=("frappe",),
)
